---
title: Generating default values
date: 2020-04-25T12:13:39.668Z
featuredImage: './generating-default-values.jpg'
description: Generating default values for variables and parameters as placeholder values
---
When generating code, you may need to instantiate a variable or a parameter with some placeholder value (On my end, I needed to assign values of base class's constructor parameters). The easiest solution will be using the default literal. Or if you want to be more traditional and support older C# versions, using 0 for value types (except structs) and null for reference types will give the same result. But these approaches have some issues with method overloading.

<!-- end -->

Let's say there are multiple Foo methods, and our intention is calling method **Foo(float f)**. Calling **Foo(0)** or **Foo(default)** will both fail. Even worse, **Foo(default)** might cause an ambiguity error.

```csharp
void FooTest(){
    Foo(default); // will give ambiguity error
    Foo(0); // returns "int"
}

string Foo(int i) => "int";
string Foo(byte b) => "byte";
string Foo(float f) => "float";
string Foo(string s) => "string";
```

```csharp
void FooTest(){
    Foo(default); // returns "byte"
    Foo(0); // returns "int"
}

string Foo(int i) => "int";
string Foo(byte b) => "byte";
string Foo(float f) => "float";
// string Foo(string s) => "string";
```

To overcome overloading ambiguity, we need to explicitly specify type of the value. Calling **Foo((float)0)** or **Foo(default(float))** will work. (Also another way of calling is with the constructor, **Foo(new float())** )

```csharp
void FooTest(){
    Foo(default(float)); // returns "float"
    Foo((float)0); // returns "float"
}

string Foo(int i) => "int";
string Foo(byte b) => "byte";
string Foo(float f) => "float";
string Foo(string s) => "string";
```

Explicitly specifying types is totally fine, except it is not easy to read for the human eye. No one would prefer to see **(float)0** or **default(float)** over **0f**.

```csharp
void FooTest(){
    Foo(0f); // returns "float"
}

string Foo(int i) => "int";
string Foo(byte b) => "byte";
string Foo(float f) => "float";
string Foo(string s) => "string";
```

Float is an exception, along with some other types. Not all types have a unique identifier suffix like **f**. But since there are some, and these are among the most used types; I decided to write a helper method for generating default value in the user-friendly way. Searching Roslyn methods and digging Roslyn source code didn't help much, so I had to write it myself.

Here is the code. I preferred to use **""** over **null** and **string.empty** for strings, **Datetime.Now** over **new DateTime()**, **IntPtr.Zero** over **new IntPtr()**.

```csharp
public static ExpressionSyntax TypeToDefaultValue(ITypeSymbol typeSymbol, bool isExplicit = false)
{
    var syntax = TypeToDefaultValueAux(typeSymbol, isExplicit, out bool cannotBeExplicit);
    if (isExplicit && cannotBeExplicit)
    {
        syntax = TypeToDefaultValueAux(typeSymbol, false, out _);
    }
    return syntax;
}

static ExpressionSyntax TypeToDefaultValueAux(ITypeSymbol typeSymbol, bool isExplicit, out bool cannotBeExplicit)
{
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/default-values-table
    // https://docs.microsoft.com/tr-tr/dotnet/csharp/language-reference/keywords/value-types-table

    cannotBeExplicit = false;

    if (typeSymbol.IsAnonymousType && isExplicit)
    {
        // type cannot be expressed since it is anonymous, typeSymbol.ToDisplayString(format) wont work
        isExplicit = false;
    }

    switch (typeSymbol.SpecialType)
    {
        case SpecialType.System_Enum:
            return SyntaxFactory.ParseExpression("(System.Enum)null")
                 .WithAdditionalAnnotations(Simplifier.Annotation);
        case SpecialType.System_ValueType:
            return SyntaxFactory.ParseExpression("(System.ValueType)null")
                 .WithAdditionalAnnotations(Simplifier.Annotation);
        case SpecialType.System_Boolean:
            return SyntaxFactory.ParseExpression("false");
        case SpecialType.System_Char:
            return SyntaxFactory.ParseExpression("'\0'");
        case SpecialType.System_SByte:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(sbyte)0") :
                SyntaxFactory.ParseExpression("0");
        case SpecialType.System_Byte:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(byte)0") :
                SyntaxFactory.ParseExpression("0");
        case SpecialType.System_Int16:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(short)0") :
                SyntaxFactory.ParseExpression("0");
        case SpecialType.System_UInt16:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(ushort)0") :
                SyntaxFactory.ParseExpression("0");
        case SpecialType.System_Int32:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(int)0") :
                SyntaxFactory.ParseExpression("0");
        case SpecialType.System_UInt32:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(uint)0") :
                SyntaxFactory.ParseExpression("0u");
        case SpecialType.System_Int64:
            return isExplicit ?
                SyntaxFactory.ParseExpression("(long)0") :
                SyntaxFactory.ParseExpression("0L");
        case SpecialType.System_UInt64:
            return SyntaxFactory.ParseExpression("0ul");
        case SpecialType.System_Decimal:
            return SyntaxFactory.ParseExpression("0m");
        case SpecialType.System_Single:
            return SyntaxFactory.ParseExpression("0f");
        case SpecialType.System_Double:
            return SyntaxFactory.ParseExpression("0d");
        case SpecialType.System_String:
            return SyntaxFactory.ParseExpression("\"\"");
            //return SyntaxFactory.ParseExpression("string.Empty");
            //return SyntaxFactory.ParseExpression("null");
        case SpecialType.System_IntPtr:
            return SyntaxFactory.ParseExpression("System.IntPtr.Zero")
                .WithAdditionalAnnotations(Simplifier.Annotation);
        case SpecialType.System_UIntPtr:
            return SyntaxFactory.ParseExpression("System.UIntPtr.Zero")
                .WithAdditionalAnnotations(Simplifier.Annotation);
        case SpecialType.System_Nullable_T:
            break;
        case SpecialType.System_DateTime:
            return SyntaxFactory.ParseExpression("System.DateTime.Now")// warning, this is not the default value, 0
                .WithAdditionalAnnotations(Simplifier.Annotation);
        default:
            break;
    }

    var isStruct = false;

    switch (typeSymbol.TypeKind)
    {
        case TypeKind.Enum:
            var defaultEnumField = typeSymbol.GetMembers().FirstOrDefault(
                m => m is IFieldSymbol mf && mf.HasConstantValue && Convert.ToInt64(mf.ConstantValue) == 0);
            if (defaultEnumField != null)
                return SyntaxFactory.ParseExpression(getDisplayString(typeSymbol, out cannotBeExplicit) + "." + defaultEnumField.Name)
                    .WithAdditionalAnnotations(Simplifier.Annotation);
            else
                return SyntaxFactory.ParseExpression("(" + getDisplayString(typeSymbol, out cannotBeExplicit) + ")0")
                    .WithAdditionalAnnotations(Simplifier.Annotation);
        case TypeKind.Error:
            // throw new Exception();// can be uncommented when debugging
            break;
        case TypeKind.Struct:
            isStruct = true;
            break;
        case TypeKind.TypeParameter:
            //var typeParameterSymbol = typeSymbol as ITypeParameterSymbol;
            if (typeSymbol.IsReferenceType)
                break;
            else if (typeSymbol.IsValueType)
            {
                isStruct = true;
                break;
            }
            else
                return SyntaxFactory.ParseExpression("default(" + getDisplayString(typeSymbol, out cannotBeExplicit) + ")")
                    .WithAdditionalAnnotations(Simplifier.Annotation);
        default:
            break;
    }


    if (isStruct)
    {
        if (typeSymbol.IsTupleType)
        {
            var named = typeSymbol as INamedTypeSymbol;
            return SyntaxFactory.ParseExpression("(" +
                String.Join(", ", named.TupleElements.Select(te => TypeToDefaultValue(te.Type, isExplicit)))
                + ")");
        }
        else if (typeSymbol.IsNullable())
        {
            // do nothing
        }
        else
        {
            return SyntaxFactory.ParseExpression("new " + getDisplayString(typeSymbol, out cannotBeExplicit) + "()")
                .WithAdditionalAnnotations(Simplifier.Annotation);
        }
    }


    return isExplicit ?
        SyntaxFactory.ParseExpression("(" + getDisplayString(typeSymbol, out cannotBeExplicit) + ")null")
            .WithAdditionalAnnotations(Simplifier.Annotation) :
        SyntaxFactory.ParseExpression("null");

    string getDisplayString(ITypeSymbol ts, out bool cantBeExplicit)
    {
        cantBeExplicit = false;

        var format = SymbolDisplayFormat.FullyQualifiedFormat
            .WithGlobalNamespaceStyle(SymbolDisplayGlobalNamespaceStyle.OmittedAsContaining);
        var display = typeSymbol.ToDisplayString(format);

        // if an inner type is anonymous, disable explicit
        if (isExplicit && display.Contains("<anonymous type"))
            cantBeExplicit = true;

        return display;
    }
}
```

Related useful links:

<https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/default-values>

<https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#integer-literals>

<https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/expressions#compile-time-checking-of-dynamic-overload-resolution>
