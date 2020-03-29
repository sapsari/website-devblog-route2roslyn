---
title: Symbols for dummies
date: 2020-03-27T14:46:06.199Z
description: Examples of roslyn symbol properties
---
Roslyn uses technical terms from programming language and compiler design. Sometimes it can be hard to understand or guess what a property retrieves or a method executes. There is not enough samples in the documentation, not enough discussion in stackoverflow, or not a tool to debug or display semantic model and symbols; so I decided to write about symbols in the simplest form. Here is a compilation of symbol properties and their representations in the language of C#.

<!-- end -->

## [ISymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol?view=roslyn-dotnet)

<hr>

* [CanBeReferencedByName](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.canbereferencedbyname?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_CanBeReferencedByName)

```csharp{1,2}
// MyClass(){} → false
// void MyMethod(){} → true

class MyClass{
	MyClass(){}
	void MyMethod(){}
}
```

<hr>

* [ContainingAssembly](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingassembly?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingAssembly)
* [ContainingModule](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingmodule?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingModule)

```csharp{1}
// returns assembly/module of the symbol
```

<hr>

* [ContainingNamespace](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingnamespace?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingNamespace)

```csharp{1}
// MyClass{} → MyNamespace
namespace MyNamespace{
	class MyClass{}
}
```

<hr>

* [ContainingSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingsymbol?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingSymbol)

```csharp{1}
// MyClass{} → MyNamespace
namespace MyNamespace{
	class MyClass{}
}
```

<hr>

* [ContainingType](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingType)

```csharp{1}
// MyInnerClass → MyClass
class MyClass{
	class MyInnerClass{}
}
```

<hr>

* [DeclaredAccessibility](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.declaredaccessibility?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_DeclaredAccessibility)

```csharp{1}
// MyClass → Public
public class MyClass{}
```

<hr>

* [DeclaringSyntaxReferences](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.declaringsyntaxreferences?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_DeclaringSyntaxReferences)

```csharp{1}
// class MyClass{} → Span [0..15)
class MyClass{}
```

<hr>

* [HasUnsupportedMetadata](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.hasunsupportedmetadata?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_HasUnsupportedMetadata)

```csharp{1}
 // false almost in all cases unless custom IL code or interop with another language is used
```

<hr>

* [IsAbstract](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isabstract?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsAbstract)

```csharp{1,4}
// MyClass → false
class MyClass{ }

// MyClass → true
abstract class MyClass{ }
```

<hr>

* [IsDefinition](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isdefinition?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsDefinition)

```csharp{1,6}
// MyClass<int> → false
class MyClass<T>{
	void MyMethod(MyClass<int> mc){ }
} 

// MyClass<T> → true
class MyClass<T>{
	void MyMethod(MyClass<T> mc){ }
}
```

<hr>

* [IsExtern](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isextern?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsExtern)

```csharp{1,4}
// MyMethod → false
void MyMethod(){ }

// MyMethod → true
[DllImport("mybinary.dll")]
static extern void MyMethod();
```

<hr>

* [IsImplicitlyDeclared](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isimplicitlydeclared?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsImplicitlyDeclared)

```csharp{1,6}
// i (2nd one) → false
void MyMethod(out int i){
	MyMethod(out i);
}

// _ → true
void MyMethod(out int i){
	MyMethod(out _);
	i = 0;
}
```

<hr>

* [IsOverride](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isoverride?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsOverride)

```csharp{1,6}
// MyMethod → false
class MyClass : MyBaseClass{
	public void MyMethod(){ }
}

// MyMethod → true
class MyClass : MyBaseClass{
	public override void MyMethod(){ }
}
```

<hr>

* [IsSealed](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.issealed?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsSealed)

```csharp{1,4}
// MyClass → false
class MyClass{ }

// MyClass → true
sealed class MyClass{ }
```

<hr>

* [IsStatic](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isstatic?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsStatic)

```csharp{1,4}
// MyClass → false
class MyClass{ }

// MyClass → true
static class MyClass{ }
```

<hr>

* [IsVirtual](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isvirtual?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsVirtual)

```csharp{1,6}
// MyMethod → false
class MyClass{
	void MyMethod(){ }
}

// MyMethod → true
class MyClass{
	virtual void MyMethod(){ }
}
```

<hr>

* [Kind](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.kind?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_Kind)


```csharp{1,4,7,10,16,19,22,25,30,35,40,45,48,51,54,57,60,63,68,72}
// using MyString = System.String → Alias
using MyString = System.String;

// int[] → ArrayType
int[] myArray;

// Assembly
// Regular C# code cannot provide this. Roslyn method CSharpCompilation.GetAssemblyOrModuleSymbol() will return this.

// _ → Discard
void MyMethod(out int i){
	MyMethod(out _);
	i = 0;
}

// dynamic → DynamicType
dynamic myDynamic;

// ErrorType
// Regular C# code cannot provide this. This is recieved if the type could not be determined due to an error when calling Roslyn method SemanticModel.GetTypeInfo().

// myEvent → Event
event Action myEvent;

// myField → Field
class MyClass{
	int myField;
}

// default: → Label
switch (0){
    default: break;
}

// myLocal → Local
void MyMethod(){
	var myLocal;
}

// void myMethod(){} → Method
class MyClass{
	void myMethod(){}
}

// class MyClass{} → NamedType
class MyClass{}

// namespace MyNamespace{} → Namespace
namespace MyNamespace{}

// NetModule
// Regular C# code cannot provide this. Roslyn method CSharpCompilation.GetAssemblyOrModuleSymbol() will return this.

// int myParameter → Parameter
void MyMethod(int myParameter){}

// int* → PointerType
int* i;

// #define MYPREPROCESSING → Preprocessing
#define MYPREPROCESSING

// int MyProperty => 3 → Property
class MyClass{
	int MyProperty => 3;
}

// from x in list → RangeVariable
var list = new List<int>();
var item = from x in list select x;

// T → TypeParameter
void MyMethod<T>(){}
```

<hr>

