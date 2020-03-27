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

```csharp{1}
// MyClass => false
class MyClass{ }
```

```csharp{1}
// MyClass => true
abstract class MyClass{ }
```

<hr>

* [IsDefinition](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isdefinition?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsDefinition)

```csharp{1}
// MyClass<int> => false
class MyClass<T>{
	void MyMethod(MyClass<int> mc){ }
} 
```

```csharp{1}
// MyClass<T> => true
class MyClass<T>{
	void MyMethod(MyClass<T> mc){ }
}
```
