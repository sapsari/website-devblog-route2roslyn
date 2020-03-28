---
title: Symbols for dummies
date: 2020-03-27T14:46:06.199Z
description: Examples of roslyn symbol properties
---
Roslyn uses technical terms from programming language and compiler design. Sometimes it can be hard to understand or guess what a property retrieves or a method executes. There is not enough samples in the documentation, not enough discussion in stackoverflow, or not a tool to debug or display semantic model and symbols; so I decided to write about symbols in the simplest form. Here is a compilation of symbol properties and their representations in the language of C#.

<!-- end -->

## [ISymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol?view=roslyn-dotnet)

<hr>

* [IsAbstract](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isabstract?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsAbstract)

```csharp{1,4}
// MyClass => false
class MyClass{ }

// MyClass => true
abstract class MyClass{ }
```

<hr>

* [IsDefinition](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isdefinition?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsDefinition)

```csharp{1,6}
// MyClass<int> => false
class MyClass<T>{
	void MyMethod(MyClass<int> mc){ }
} 

// MyClass<T> => true
class MyClass<T>{
	void MyMethod(MyClass<T> mc){ }
}
```

<hr>

* [IsExtern
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isextern?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsExtern)

```csharp{1,4}
// MyMethod => false
void MyMethod(){ }

// MyMethod => true
[DllImport("mybinary.dll")]
static extern void MyMethod();
```

<hr>

* [IsImplicitlyDeclared](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isimplicitlydeclared?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsImplicitlyDeclared)

```csharp{1,6}
// i (2nd one) => false
void MyMethod(out int i){
	MyMethod(out i);
}

// _ => true
void MyMethod(out int i){
	MyMethod(out _);
	i = 0;
}
```

<hr>

* [IsOverride
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isoverride?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsOverride)

```csharp{1,6}
// MyMethod => false
class MyClass : MyBaseClass{
	public void MyMethod(){ }
}

// MyMethod => true
class MyClass : MyBaseClass{
	public override void MyMethod(){ }
}
```

<hr>

* [IsSealed
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.issealed?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsSealed)

```csharp{1,3}
// MyClass => false
class MyClass{ }

// MyClass => true
sealed class MyClass{ }
```

<hr>

* [IsStatic
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isstatic?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsStatic)

```csharp{1,3}
// MyClass => false
class MyClass{ }

// MyClass => true
static class MyClass{ }
```

<hr>

* [IsVirtual
  ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isvirtual?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsVirtual)
```csharp{1,6}
// MyMethod => false
class MyClass{
	void MyMethod(){ }
}

// MyMethod => true
class MyClass{
	virtual void MyMethod(){ }
}
```
<hr>
