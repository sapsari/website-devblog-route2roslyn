---
title: Symbols and types for dummies
date: 2020-03-27T14:46:06.199Z
description: Examples of roslyn symbol properties
featuredImage: './symbols-for-dummies.jpg'
---
Roslyn uses a lot of technical terms from programming language and compiler design. Sometimes it can be hard to understand or guess what a property retrieves or a method executes for regular coders. There is not enough samples in the documentation, not enough discussion in stackoverflow, or not a tool to debug or display semantic model and symbols; so I decided to write about symbols in the simplest form, as code snippets.

<!-- end -->

I especially recommend looking at <a href="#isymbol_kind">ISymbol.Kind</a>, <a href="#itypesymbol_specialtype">ITypeSymbol.SpecialType</a>, <a href="#itypesymbol_typekind">ITypeSymbol.Typekind</a>. They can be very useful for considering all cases/types when developing or testing with Roslyn. Here is a compilation of symbol properties and their representations in the language of C#.

Shortcuts:

<a href="#isymbol">ISymbol</a>

<a href="#inamespaceortypesymbol">INamespaceOrTypeSymbol</a>

<a href="#itypesymbol">ITypeSymbol</a>

<a href="#inamedtypesymbol">INamedTypeSymbol</a>

<hr>
<hr>

## <p id="isymbol">[ISymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol?view=roslyn-dotnet)</p>

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

```csharp{1,2}
// → false
// almost in all cases unless custom IL code or interop with another language is used
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

* [<p id="isymbol_kind">Kind</p>](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.kind?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_Kind)

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

## <p id="inamespaceortypesymbol">[INamespaceOrTypeSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamespaceortypesymbol?view=roslyn-dotnet)</p>

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

## <p id="itypesymbol">[ITypeSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol?view=roslyn-dotnet)</p>

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

* [<p id="itypesymbol_specialtype">SpecialType</p>](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.specialtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_SpecialType)

SpecialType enumuration documentation gives all the examples, so skipping this property.

<https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.specialtype?view=roslyn-dotnet>

<hr>

* [<p id="itypesymbol_typekind">TypeKind</p>](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.itypesymbol.typekind?view=roslyn-dotnet#Microsoft_CodeAnalysis_ITypeSymbol_TypeKind)

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
// Not available in C#, specific to Visual Basic

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

## <p id="inamedtypesymbol">[INamedTypeSymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol?view=roslyn-dotnet)</p>

<hr>
<hr>

* [Arity
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.arity?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_Arity)

```csharp{1,4}
// MyClass → 0
class MyClass{}

// MyGenericClass → 2
class MyGenericClass<T1,T2>{}
```

<hr>

* [AssociatedSymbol
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.associatedsymbol?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_AssociatedSymbol)

```csharp{1,2}
// → null
// Regular C# code cannot provide this. Indicates synthesized class by the compiler.
```

<hr>

* [ConstructedFrom
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.constructedfrom?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_ConstructedFrom)

```csharp{1,8}
// MyClass → MyClass
class MyClass{}{
	void MyMethod(){
		var mc = new MyClass();
	}
}

// MyGenericClass<int> → MyGenericClass<T>
class MyGenericClass<T>{
    void MyMethod(){
        var mgc = new MyGenericClass<int>();
}}
```

<hr>

* [Constructors
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.constructors?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_Constructors)

```csharp{1}
// MyClass → MyClass(), MyClass(int i)
class MyClass{
	static MyClass(){}
	public MyClass(int i){}
}
```

<hr>

* [DelegateInvokeMethod
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.delegateinvokemethod?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_DelegateInvokeMethod)

```csharp{1,2}
// MyClass → null
// MyDelegate → void MyClass.MyDelegate.Invoke()
class MyClass{
	delegate void MyDelegate();
}
```

<hr>

* [EnumUnderlyingType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.enumunderlyingtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_EnumUnderlyingType)

```csharp{1,4,7}
// MyClass → null
class MyClass{}

// MyEnum → int
enum MyEnum {1,2,3}

// MyShortEnum → short
enum MyShortEnum : short {1,2,3}
```

<hr>

* [InstanceConstructors
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.instanceconstructors?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_InstanceConstructors)

```csharp{1}
// MyClass → MyClass(int i)
class MyClass{
	static MyClass(){}
	public MyClass(int i){}
}
```

<hr>

* [IsComImport
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.iscomimport?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_IsComImport)

```csharp{1,4}
// MyClass → false
class MyClass{}

// MyComClass → true
[ComImport]
[Guid("73EB4AF8-BE9C-4b49-B3A4-24F4FF657B26")]
class MyComClass{}
```

<hr>

* [IsGenericType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.isgenerictype?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_IsGenericType)

```csharp{1,4}
// MyClass → false
class MyClass{}

// MyGenericClass → true
class MyGenericClass<T1,T2>{}
```

<hr>

* [IsImplicitClass
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.isimplicitclass?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_IsImplicitClass)

```csharp{1,2}
// → false
// Regular C# code cannot provide this. Internal classes generated by Roslyn can have this.
```

<hr>

* [IsScriptClass
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.isscriptclass?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_IsScriptClass)

```csharp{1,2}
// → false
// Regular C# code cannot provide this. Indicates synthesized class by the compiler.
```

<hr>

* [IsSerializable
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.isserializable?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_IsSerializable)

```csharp{1,4}
// MyClass → false
class MyClass{}

// MySerializableClass → true
[Serializable]
class MySerializableClass{}
```

<hr>

* [IsUnboundGenericType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.isunboundgenerictype?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_IsUnboundGenericType)

```csharp{1,2}
// MyGenericClass<T1,T2> → false
// MyGenericClass<,> → true
class MyGenericClass<T1,T2>{
	void MyMethod(){
		var t = typeof(MyGenericClass<,>);
	}
}
```

<hr>

* [MemberNames
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.membernames?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_MemberNames)

```csharp{1}
// MyClass → myField, MyProperty, MyMethod
class MyClass{
    int myField;
    int MyProperty => 0;
    void MyMethod(){};
}
```

<hr>

* [MightContainExtensionMethods
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.mightcontainextensionmethods?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_MightContainExtensionMethods)

```csharp{1,4}
// MyClass → false
static class MyClass{}

// MyClass → true
static class MyClass{
	public static int MyExtensionMethod(this String str){
        return 0;
    }
}
```

<hr>

* [StaticConstructors
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.staticconstructors?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_StaticConstructors)

```csharp{1}
// MyClass → MyClass()
class MyClass{
	static MyClass(){}
	public MyClass(int i){}
}
```

<hr>

* [TupleElements
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.tupleelements?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_TupleElements)

```csharp{1,4}
// int → Uninitialized
int i;

// (int, float) → int, float
(int, float) t;
```

<hr>

* [TupleUnderlyingType
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.tupleunderlyingtype?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_TupleUnderlyingType)

```csharp{1,4,7}
// int → null
int i;

// ValueTuple<int, float> → null
ValueTuple<int, float> vt;

// (int, float) → ValueTuple<int, float>
(int, float) t;
```

<hr>

* [TypeArgumentNullableAnnotations
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.typeargumentnullableannotations?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_TypeArgumentNullableAnnotations)

```csharp{1,2}
// IMyInterface<T> → None
// IMyInterface<U?> → Annotated
interface IMyInterface<K>{}
class MyGenericClass<T, U> where U : struct {
	IMyInterface<T> myField;
	IMyInterface<U?> myFieldNullable;
}
```

<hr>

* [TypeArguments
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.typearguments?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_TypeArguments)

```csharp{1,2}
// MyGenericClass<int, float> → int, float
// MyGenericClass<T, U> → T, U

class MyGenericClass<T, U>{
	void MyMethod(){
		var mgc = new MyGenericClass<int, float>();
	}
}
```

<hr>

* [TypeParameters
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.inamedtypesymbol.typeparameters?view=roslyn-dotnet#Microsoft_CodeAnalysis_INamedTypeSymbol_TypeParameters)

```csharp{1,2}
// MyGenericClass<int, float> → T, U
// MyGenericClass<T, U> → T, U

class MyGenericClass<T, U>{
	void MyMethod(){
		var mgc = new MyGenericClass<int, float>();
	}
}
```

<hr>
