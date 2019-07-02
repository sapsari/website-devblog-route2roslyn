---
title: Making Visual Studio extension command visibility optional
date: 2019-07-02T13:20:51.257Z
description: VSIX
---
So you are developing a Visual Studio extension which has some commands. And you want to make these commands' visibility optional, so that the user can hide or display these commands based on her preference. Sounds pretty simple, right. Well, unfortunately it is anything but simple. Because it requires implementing multiple features just for one task, and these features are mostly unrelated.

First, let's talk about _why_. Why I want to make the commands' visibility optional. My extension is accessible from Quick Actions menu, from main menu 'View' → 'Other Windows', from editor context menu and from explorer item context menu. They all do the same thing, but I inserted it into as many places as possible, because I want it to be as accessible as possible; so that new users will find it easily without reading any manual. The other reason is for marketing; the more you pop your product in the user's eye, the more she will remember and use it. But this approach has a drawback, some users might use the extension rarely or might feel their UI got overcrowded. For these cases, we give them the option to hide these shortcuts.

The implementations is made of three distinct parts, but I add a setup part in case of your extension doesn't have a command or an options page. The parts are:

1. Setup
2. Changing visibility dynamically
3. Writing to registry
4. Setting initial visibility

## 1. Setup

In setup part, I will create a new project for extension, then add a command and an options page to it. I'm using Visual Studio 2019 version 16.1.4, but it should work on 2017 too. Also make sure to install the 'Visual Studio extension development' workload under 'Other Toolsets'.

I'll quickly go over setup since it's not the focus of the blog. You can otheXXX

First create a new project with the template of 'VSIX Project' (VSIX stands for Visual Studio extension installer, our project's output will be an installer of our extension). The project should have a package class (.cs file for it) and a manifest file. You can customize your extension's name, version, description and many more in the manifest file.

Hit 'F5' to test the extension. This will create a new Visual Studio instance, with its own settings and extensions (which is called Experimental Instance). The extension will be automatically installed in this instance. It will take a while to start Visual Studio for the first time. When loaded, view installed extension from top menu 'Extensions' → 'Manage Extensions', and our extension should appear  on the list. A tip is not using rebuilding the project or solution, or the extension might not get updated correctly in the experimental instance. If the extension is not getting updated for some reason, try to increment version number in the manifest file.

For now the extension has nothing and does nothing. Time to add a command to it, which will add a UI element to Visual Studio so that the extension will be accessible to users. Commands are the way you add actions to Visual Studio. Add a new item to the project, on left pane of pop-up window choose 'Extensibility' and on the list choose 'Custom Command'. This template command adds an item to the top menu 'Tools'.

Now there is three more files. A cs file for the command class; a png image file for the command's resource; and vsct, command table file, in which some command data is stored, its like the header for the commands (if you had a command before, vsct will be updated insted of being inserted)

We will focus on the command table file later, for now you can change UI display name from there, just search for 'Invoke ' and change the full text. You can change UI icon from the resource file. And your command's functionality is in the 'Execute' method of your command class, of which can be changed. Test the extension again. A new item should appear in top menu'Tools'.

XXX SS tools command

Next step is adding the options page. It is quite easy to do. Add this class into your project:

```csharp
using System.ComponentModel;
using Microsoft.VisualStudio.Shell;
using Microsoft.VisualStudio.Shell.Settings;
using Microsoft.VisualStudio.Settings;
using Task = System.Threading.Tasks.Task;

namespace YellowNamespace
{
    [DesignerCategory("code")] // to hide designer
    class YellowOptionsPage : DialogPage
    {
        [Category("UI")]
        [DisplayName("Display command")]
        [Description("Display or hide extension shortcut in Tools menu")]
        public bool IsDisplayingYellowCommand { get; set; } = true;
    }
}
```

Each public property will be displayed in the options page. 'Category' attribute will group them. Then add 'ProvideOptionPage' attribute to your package.

```csharp
[PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
[Guid(YellowPackage.PackageGuidString)]
[ProvideMenuResource("Menus.ctmenu", 1)]
[ProvideOptionPage(typeof(YellowOptionsPage), "Yellow Extension", "General", 0, 0, true)]
public sealed class YellowPackage : AsyncPackage
```

XXX TEST. Your extension can have multiple options pages. To do it, add another DialogPage derived class, and add another ProvideOptionPage attribute for it.

We have an extension with a command and an options page, we could move on to changing our command's visibility.

## 2. Changing visibility dynamically

We want to change command's visibility dynamically, so let's take a look at the command class. It does not inherit a class. It's fields are id, guid and package; both are irrelevant. But inside the constructor, we see a variable named menuItem of type MenuCommand. Inspect its members and you'll see property Visible, which is settable. Let's try assigning it.

```csharp
private YellowCommand(AsyncPackage package, OleMenuCommandService commandService)
{
	this.package = package ?? throw new ArgumentNullException(nameof(package));
	commandService = commandService ?? throw new ArgumentNullException(nameof(commandService));

	var menuCommandID = new CommandID(CommandSet, CommandId);
	var menuItem = new MenuCommand(this.Execute, menuCommandID);
	commandService.AddCommand(menuItem);

	// TODO, remove this later
	menuItem.Visible = false;
}
```

If you test the extension, you will see that nothing changes. Unfortunately, we need to mark the command. Add CommandFlag DynamicVisibility to your command in the command table.

```xml
<Button guid="guidYellowPackageCmdSet" id="YellowCommandId" priority="0x0100" type="Button">
  <Parent guid="guidYellowPackageCmdSet" id="MyMenuGroup" />
  <Icon guid="guidImages" id="bmpPic1" />
  <CommandFlag>DynamicVisibility<!--This flag makes setting property Visible functional--></CommandFlag>
  <Strings>
    <ButtonText>SMILE :)<!--Change text of the menu item here--></ButtonText>
  </Strings>
</Button>
```

Test again, and you will see your command will be hidden when you clicked on it. Now that we have found what we seek, time to use it properly. Undo command's constructor and let's head back to options page. Options page's base class, class DialogPage have virtual methods named SaveSettingsToStorage, SaveSettingsToXml  and OnApply; all of which are called when options are changed. I'm choosing SaveSettingsToStorage because we will read from and write to storage later. Override the method and change our command's visibility inside.

```csharp
// This method is called each time an option value is changed
public override void SaveSettingsToStorage()
{
	base.SaveSettingsToStorage();

	// Retrieve the command and change its visibility
	OleMenuCommandService commandService = this.GetService(typeof(System.ComponentModel.Design.IMenuCommandService)) as OleMenuCommandService;
	var yellowCommand = commandService.FindCommand(new System.ComponentModel.Design.CommandID(YellowCommand.CommandSet, YellowCommand.CommandId));
	yellowCommand.Visible = IsDisplayingYellowCommand;
}
```

Test your extension, and you will see that command becomes visible when the option is set to true and becomes hidden when set to false.

But we have a very big problem here. Assume the user wants to hide the command and sets the option to false. When she changes the option, the command will be hidden. But when Visual Studio restarts, the command will be visible again. Well okay, that's expected since we assign the property Visible only in the options. If we are to assign it in the package initializer too (it's like the Main method, method InitializeAsync is called first on your extension), it will be fixed, right (spoilers, no it won't).

CODE (of ctor with visible=false)

It won't work because Visual Studio does not load the extension until it is needed, meaning Visual Studio does not execute any code from the extension until it is needed. Showing commands in the top menu or context menu is not enough for initializing the package, because they are only UI elements, like shortcuts. So, we need something, and that thing cannot be C# code, for adjusting command visibility before our package loads.

One way of solving it will be adding attribute ProvideAutoLoad to the package. It will make our package to be automatically loaded when Visual Studio starts up or a solution is loaded etc. I don't recommend using it since it will slow down start up or loading time. But maybe, if you are prototyping, you may use this and skip the next two steps.

CODE autoload

## 3. Writing to registry

Next part requires reading from registry, for simplicity I will be implementing this part beforehand.

Our extension's option values are already stored in the registry. Registry is where Visual Studio's option values are read from and written to, but they are not in the format we need. Option values are stored as strings, even if they are booleans or integers. We want our boolean value to be stored as zero or non-zero value. First locate them in the registry. Visual Studio does not use system registry, it has its own registry file (as of version 2017, so that we can have multiple versions of it installed). [This document](https://github.com/Microsoft/VSProjectSystem/blob/master/doc/overview/examine_registry.md) explains how to open it. Expand through Software → `Microsoft` → `VisualStudio` → 16.0_306b9970Exp → ApplicationPrivateSettings → YellowNamespace → YellowOptionsPage. You should see property IsDisplayingYellowCommand, and its value '1\*System.Boolean\*True'.

PAINT SCREENHSOT

Use existing method of SaveSettingsToStorage for saving our custom registry property. Create WritableSettingsStore, a helper class for writing to registry, then use it to store the custom property. Path and property name can be customized to your needs. XXX

```csharp
[DesignerCategory("code")] // to hide designer
class YellowOptionsPage : DialogPage
{
	/// <summary>
	/// Where extension options are stored in the registry, can be get from base property SharedSettingsStorePath
	/// </summary>
	const string registryCollectionPath = @"ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage";
	const string propertyName = nameof(IsDisplayingYellowCommand) + "Raw";

	[Category("UI")]
	[DisplayName("Display command")]
	[Description("Display or hide extension shortcut in Tools menu")]
	public bool IsDisplayingYellowCommand { get; set; } = true;

	// This method is called each time an option value is changed
	public override void SaveSettingsToStorage()
	{
		base.SaveSettingsToStorage();

		// overridden base method is not async, so run our own async method with ThreadHelper
		ThreadHelper.JoinableTaskFactory.Run(async delegate
		{
			await SaveSettingsToStorageAuxAsync();
		});
	}

	async Task SaveSettingsToStorageAuxAsync()
	{
		// Retrieve the command and change its visibility
		OleMenuCommandService commandService = this.GetService(typeof(System.ComponentModel.Design.IMenuCommandService)) as OleMenuCommandService;
		var yellowCommand = commandService.FindCommand(new System.ComponentModel.Design.CommandID(YellowCommand.CommandSet, YellowCommand.CommandId));
		yellowCommand.Visible = IsDisplayingYellowCommand;

		// Write custom property to the registry
		await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
		var settingsManager = new ShellSettingsManager(ServiceProvider.GlobalProvider);
		var userSettingsStore = settingsManager.GetWritableSettingsStore(SettingsScope.UserSettings);
		userSettingsStore.SetBoolean(registryCollectionPath, propertyName, IsDisplayingYellowCommand);
	}
}
```

Run the extension, save the options then examine the registry, make sure the custom property is stored before proceeding to the next part.

## 4.Setting initial visibility

Our aim was to change command visibility without loading the package. For this we will use _rule-based UI Context_. Remember the command table file, it's an xml file, it doesn't have any C# code; and Visual Studio parses it even if its package is not loaded. We can define a rule in this file by adding a visibility constraint.

Take a look at the [documentation](https://docs.microsoft.com/en-us/visualstudio/extensibility/how-to-use-rule-based-ui-context-for-visual-studio-extensions?view=vs-2019), especially term types. Terms are mostly related with project and solution, but term UserSettingsStoreQuery:<query> is the one we need (unfortunately googling UserSettingsStoreQuery results only to this documentation by the time I write this post; and the information is quite limited, which is the other reason I'm writing this post). It enables us define a rule by a registry value.

If query (registry value) does not exist, it returns false; if the query evaluates to a zero value, it returns false; if the query evaluates to a non-zero value, it evaluates to true. This is why we needed to write our custom property to registry, because otherwise it would have evaluated to non-zero in all cases since original ones are stored as strings.

Query string needs the same collection path that was used in WritableSettingsStore, and a slash and property name appended to it, like this:

```csharp
collectionPath = @"ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage";
propertyName = @"IsDisplayingYellowCommandRaw";
queryString = @"ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage\IsDisplayingYellowCommandRaw";
term = @"UserSettingsStoreQuery:ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage\IsDisplayingYellowCommandRaw"
```

UserSettingsStoreQuery:<query> (or `@"UserSettingsStoreQuery:ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage\IsDisplayingYellowCommandRaw"`) is just one _term_. Terms are like variables, you can define multiple terms, then use them in the _expression_. Expression is a like a if condition with operants & \[and], | \[or], ! \[not], () \[parentheses]. Examples in the [documentation](docs.microsoft.com/en-us/visualstudio/extensibility/how-to-use-rule-based-ui-context-for-visual-studio-extensions?view=vs-2019) will give you a better idea.

Time for the implementation. First declare a const string in OptionsPage for the query of the rule.

```csharp
/// <summary>
/// Where extension options are stored in the registry, can be get from base property SharedSettingsStorePath
/// </summary>
const string registryCollectionPath = @"ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage";
const string propertyName = nameof(IsDisplayingYellowCommand) + "Raw";

/// Full path into registry for boolean value of IsDisplayingYellowCommand, to be consumed by UI context rule
/// </summary>
public const string RegistryFullPathToIsDisplayingYellowCommandAsBoolean = registryCollectionPath + @"\" + propertyName;
```

In the command table (.vsct file), create a new GuidSymbol with a new guid. Then add a VisibilityConstraint item where guid and id is same as the command's, and context is the new guid that just got created.

```xml
</Commands>

<VisibilityConstraints>
<!-- UI context rule of 'guidUIContextRuleOfYellowCommand' is bind to the command 'YellowCommand' here -->
<VisibilityItem guid="guidYellowPackageCmdSet" id="YellowCommandId" context="guidUIContextRuleOfYellowCommand" />
</VisibilityConstraints>

<Symbols>
<!-- This is the package guid. -->
<GuidSymbol name="guidYellowPackage" value="{b31fac4c-e69c-4607-830a-3a0f9af1a42b}" />

<!-- This is the UI context rule guid. -->
<GuidSymbol name="guidUIContextRuleOfYellowCommand" value="{cc77a238-dcac-447c-bc95-bfd4d760d7e6}" />

<!-- This is the guid used to group the menu commands together -->
<GuidSymbol name="guidYellowPackageCmdSet" value="{5ab63779-e371-4a31-9bc0-ca15faff478c}">
<IDSymbol name="MyMenuGroup" value="0x1020" />
<IDSymbol name="YellowCommandId" value="0x0100" />
</GuidSymbol>
```

We are done with the command table. We define the rule as an attribute for the package class.

```csharp
[PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
[Guid(YellowPackage.PackageGuidString)]
[ProvideMenuResource("Menus.ctmenu", 1)]
[ProvideOptionPage(typeof(YellowOptionsPage), "Yellow Extension", "General", 0, 0, true)]
[ProvideUIContextRule("b31fac4c-e69c-4607-830a-3a0f9af1a42b", "UIContextRuleOfYellowCommand",
"userWantsToSeeIt",
new[] { "userWantsToSeeIt" },
new[] { "UserSettingsStoreQuery:" + YellowOptionsPage.RegistryPathToIsDisplayingYellowCommand}
)]
public sealed class YellowPackage : AsyncPackage
{
// where YellowOptionsPage.RegistryPathToIsDisplayingYellowCommand =>
// ApplicationPrivateSettings\YellowNamespace\YellowOptionsPage\IsDisplayingYellowCommandRaw
```

I have named my term userWantsToSeeIt. Also we use the same guid in the command table (.vsct file).

We almost achieved what we have wished for. When user changes the options, the visibility of our command changes too. And command's visibility is now persistent, is not being effected when Visual Studio restarts. There is one minor issue left. When Visual Studio starts after installing the extension, registry will be empty. So the term userWantsToSeeIt will be false since there is no registry value in that path. And remember that original option value is stored as string, and always returns true, as long as it is stored.

Declare this field and method to options class

```csharp
/// Full path into registry for boolean value of IsDisplayingYellowCommand, to be consumed by UI context rule
/// </summary>
public const string RegistryFullPathToIsDisplayingYellowCommandAsBoolean = registryCollectionPath + @"\" + propertyName;

public async Task InitializeSettingsToStorageAsync()
{
	// Make sure custom property exists in the registry
	await ThreadHelper.JoinableTaskFactory.SwitchToMainThreadAsync();
	var settingsManager = new ShellSettingsManager(ServiceProvider.GlobalProvider);
	var userSettingsStore = settingsManager.GetWritableSettingsStore(SettingsScope.UserSettings);
	if (!userSettingsStore.CollectionExists(registryCollectionPath))
		userSettingsStore.CreateCollection(registryCollectionPath);
	if (!userSettingsStore.PropertyExists(registryCollectionPath, propertyName))
		userSettingsStore.SetBoolean(registryCollectionPath, propertyName, IsDisplayingYellowCommand);
}
```

Then update the UI context rule expression and call method InitializeSettingsToStorageAsync from options page

```csharp
[PackageRegistration(UseManagedResourcesOnly = true, AllowsBackgroundLoading = true)]
[Guid(YellowPackage.PackageGuidString)]
[ProvideMenuResource("Menus.ctmenu", 1)]
[ProvideOptionPage(typeof(YellowOptionsPage), "Yellow Extension", "General", 0, 0, true)]
[ProvideUIContextRule("cc77a238-dcac-447c-bc95-bfd4d760d7e6", "UIContextRuleOfYellowCommand",
	expression: "userWantsToSeeIt|!hasRunBefore",
	termNames: new[] { "userWantsToSeeIt", "hasRunBefore" },
	termValues: new[] {
		"UserSettingsStoreQuery:" + YellowOptionsPage.RegistryFullPathToIsDisplayingYellowCommandAsBoolean,
		"UserSettingsStoreQuery:" + YellowOptionsPage.RegistryFullPathToIsDisplayingYellowCommandAsString
	}
)]
public sealed class YellowPackage : AsyncPackage
```

Now all cases are handled. When user changes the options, the visibility of our command changes too. And command's visibility is persistent, is not being effected when Visual Studio restarts. And command's visibility is correct, even if the package is never loaded.

There is one final bug left, which is not available for the sample code. When command visibility is changed dynamically after options are updated, UI context rule is no more valid. My extension uses one more term in the UI context rule, which is "HierSingleSelectionName:.cs$". It's command is displayed in the explorer item context menu for only cs files, not for other file types. But when user updates the options, that rules becomes invalid and the command is displayed for all file types. I let this bug unresolved since it's not an important one.

Well, that's it. You can [access to the sample project on github](https://github.com/sapsari/sample-project-visual-studio-extension-making-command-visibility-optional), I committed each step one by one, don't forget to replace guids if you build something upon it.  Also you can see the functionality in action in [my extension, Pattern Maker](https://marketplace.visualstudio.com/items?itemName=MerryYellow.patternmaker).
