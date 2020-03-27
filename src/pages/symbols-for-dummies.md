---
title: Symbols for dummies
date: 2020-03-27T14:46:06.199Z
description: Examples of roslyn symbol properties
---
Roslyn uses technical terms from programming language and compiler design. Sometimes it can be hard to understand or guess what a property retrieves or a method executes. Here is a compilation of symbol properties and their representations in the language of C#.

<!-- end -->

## [ISymbol](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol?view=roslyn-dotnet)

* [IsAbstract](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isabstract?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsAbstract)


```
class MyClass{ }
```

> MyClass => false

```
abstract class MyClass{ }
```

> MyClass => true

* [IsDefinition](https://docs.microsoft.com/en-us/dotnet/api/microsoft.codeanalysis.isymbol.isdefinition?view=roslyn-dotnet#Microsoft_CodeAnalysis_ISymbol_IsDefinition)


```
class MyClass<T>{ void MyMethod(MyClass<int> mc){ } } 
```

> MyClass<int> => false

```
class MyClass<T>{ void MyMethod(MyClass<T> mc){ } }
```

> MyClass<T> => true
