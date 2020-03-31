---
title: Symbols for dummies
date: 2020-03-27T14:46:06.199Z
description: Examples of roslyn symbol properties
---
Roslyn uses technical terms from programming language and compiler design. Sometimes it can be hard to understand or guess what a property retrieves or a method executes. There is not enough samples in the documentation, not enough discussion in stackoverflow, or not a tool to debug or display semantic model and symbols; so I decided to write about symbols in the simplest form. Here is a compilation of symbol properties and their representations in the language of C#.

<!-- end -->

<hr>
<hr>

## [ISymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol?view=roslyn-dotnet)

<hr>
<hr>

* [CanBeReferencedByName](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.canbereferencedbyname?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_CanBeReferencedByName)

```csharp{1,2}
// MyClass(){} → false
// void MyMethod(){} → true

class MyClass{
	MyClass(){}
	void MyMethod(){}
}
```

<hr>

* [ContainingAssembly](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingassembly?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingAssembly)
* [ContainingModule](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingmodule?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingModule)

```csharp{1}
// returns assembly/module of the symbol
```

<hr>

* [ContainingNamespace](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingnamespace?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingNamespace)

```csharp{1}
// MyClass → MyNamespace
namespace MyNamespace{
	class MyClass{}
}
```

<hr>

* [ContainingSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingsymbol?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingSymbol)

```csharp{1}
// MyClass → MyNamespace
namespace MyNamespace{
	class MyClass{}
}
```

<hr>

* [ContainingType](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.containingtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_ContainingType)

```csharp{1}
// MyInnerClass → MyClass
class MyClass{
	class MyInnerClass{}
}
```

<hr>

* [DeclaredAccessibility](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.declaredaccessibility?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_DeclaredAccessibility)

```csharp{1}
// MyClass → Public
public class MyClass{}
```

<hr>

* [DeclaringSyntaxReferences](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.declaringsyntaxreferences?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_DeclaringSyntaxReferences)

```csharp{1}
// class MyClass{} → Span [0..15)
class MyClass{}
```

<hr>

* [HasUnsupportedMetadata](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.hasunsupportedmetadata?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_HasUnsupportedMetadata)

```csharp{1}
// → false// almost in all cases unless custom IL code or interop with another language is used
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

* [Language](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.language?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_Language)

```csharp{1}
// → C#
```

<hr>

* [Locations](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.locations?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_Locations)

```csharp{1}
// → MySourceFile.cs
```

<hr>

* [MetadataName](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.metadataname?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_MetadataName)

```csharp{1,2}
// MyClass → MyClass
// MyGenericClass → MyGenericClass`1
class MyClass{}
class MyGenericClass<T>{}
```

<hr>

* [Name](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.name?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_Name)

```csharp{1,2}
// MyClass → MyClass
// MyGenericClass → MyGenericClass
class MyClass{}
class MyGenericClass<T>{}
```

<hr>

* [OriginalDefinition](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.originaldefinition?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_OriginalDefinition)

```csharp{1,2}
// MyClass → MyClass
// MyGenericClass<int> → MyGenericClass<T>
class MyClass{}
class MyGenericClass<T>{
	void MyMethod(MyGenericClass<int> p){}
}
```

<hr>
<hr>

## [INamespaceOrTypeSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamespaceortypesymbol?view=roslyn-dotnet)

<hr>
<hr>

* [IsNamespace](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamespaceortypesymbol.isnamespace?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamespaceOrTypeSymbol_IsNamespace)

```csharp{1,4}
// MyClass → false
class MyClass{}

// MyNamespace → true 
namespace MyNamespace{}
```

<hr>

* [IsType](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamespaceortypesymbol.istype?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamespaceOrTypeSymbol_IsType)

```csharp{1,4}
// MyNamespace → false
namespace MyNamespace{}

// MyClass → true
class MyClass{}
```

<hr>
<hr>

## [ITypeSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol?view=roslyn-dotnet)

<hr>
<hr>

* [AllInterfaces
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.allinterfaces?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_AllInterfaces)

```csharp{1,2}
// MyBaseClass → IMyBaseClassInterface
// MyClass → IMyBaseClassInterface, IMyClassInterface
interface IMyBaseClassInterface{}
interface IMyClassInterface{}
class MyBaseClass : IMyBaseClassInterface{}
class MyClass : MyBaseClass, IMyClassInterface{}
```

<hr>

* [BaseType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.basetype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_BaseType)

```csharp{1,2}
// MyBaseClass → System.Object
// MyClass → MyBaseClass
class MyBaseClass{}
class MyClass : MyBaseClass{}
```

<hr>

* [Interfaces
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.interfaces?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_Interfaces)

```csharp{1,2}
// MyBaseClass → IMyBaseClassInterface
// MyClass → IMyClassInterface
interface IMyBaseClassInterface{}
interface IMyClassInterface{}
class MyBaseClass : IMyBaseClassInterface{}
class MyClass : MyBaseClass, IMyClassInterface{}
```

<hr>

* [IsAnonymousType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.isanonymoustype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsAnonymousType)

```csharp{1,4}
// var → false
var i = 0;

// var → true
var a = new {0};
```

<hr>

* [IsReadonly
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.isreadonly?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsReadOnly)

```csharp{1,4}
// MyStruct → false
struct MyStruct{}

// MyStruct → true
readonly struct MyStruct{}
```

<hr>

* [IsRefenceType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.isreferencetype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsReferenceType)

```csharp{1,4}
// MyStruct → false
struct MyStruct{}

// MyClass → true
class MyClass{}
```

<hr>

* [IsRefLikeType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.isrefliketype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsRefLikeType)

```csharp{1,4}
// MyStruct → false
struct MyStruct{}

// MyStruct → false
ref struct MyStruct{}
```

<hr>

* [IsTupleType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.istupletype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsTupleType)

```csharp{1,4}
// var → false
var myValue = 0;

// var → true
var myTuple = new (1,2);
```

<hr>

* [IsUnmanagedType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.isunmanagedtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsUnmanagedType)

```csharp{1,4}
// string → false
string s = "";

// int → true
int i = 0;
```

<hr>

* [IsValueType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.isvaluetype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_IsValueType)

```csharp{1,4}
// MyClass → false
class MyClass{}

// MyStruct → true
struct MyStruct{}
```

<hr>

* [OriginalDefinition
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.originaldefinition?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_OriginalDefinition)

```csharp{1}
// MyClass<int> → MyClass<T>
class MyClass<T>{
	void MyMethod(MyClass<int> mc){ }
}
```

<hr>

* [SpecialType](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.specialtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_SpecialType)

SpecialType enumuration documentation gives all the examples, so skipping this property.

https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.specialtype?view=roslyn-dotnet

<hr>

* [TypeKind](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.typekind?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_TypeKind)

```csharp{1,4,7,10,13,17,20,23,26,29,32,35,38}
// int[] → Array
int[] myArray;

// MyClass → Class
class MyClass{}

// MyDelegate → Delegate
delegate void MyDelegate();

// dynamic → Dynamic
dynamic myDynamic;

// MyEnum → Enum
enum MyEnum {One, Two};
MyEnum me;

// Error
// If type cannot be resolved due to ambiguity or accessibility etc.

// MyInterface → Interface
interface MyInterface{}

// Module
// Not available in C#, spesific to Visual Basic

// int* → Pointer
int* myPointer;

// MyStruct → Struct
struct MyStruct{}

// Submission
// Regular C# code cannot provide this. Indicates synthesized type by the compiler.

// T → TypeParameter
class MyClass<T>{}

// Unknown
// Regular C# code cannot provide this. Internal error in Roslyn may cause this.
```

<hr>
<hr>
