---
aliases:
author: Alejandro García Peláez
categories:
- The path of programming
date: "2023-02-01"
description:
image: 
series:
tags:
title: R and Rstudio
---

# Fundamental Concepts

## Variable assignment 

Variable assignment is done with the use of '<-'. This notation comes from the '*pipelines*' or pipelines that we can see present in some operating systems like GNU/Linux (in the case of Linux the use of pipelines is carried out with the notation '|' that allows to redirect the output of a command or **stdout** to the input of another or **stdin**).

If we want to give the variable x the value of the square root of 16, we could do it as follows:

```r
  x <- sqrt(16)
```

## Basic data types

Similar to Python , with a small change in integer notation:

* Type '**numeric**': real numbers and integers; the difference in notation is that you must type the number followed by an L. 


* Type '**character**': character string.


* Type '**complex**': complex numbers (e.g. 5+4i).


* Type '**logical**': logical values; evaluates to TRUE or FALSE.


With the function '**class**' we can see the type of the data we pass as argument.

With the function '**is.()**' (where 'type_data' we replace it with the type we want to check) we can check if the argument we pass it is of a certain type.

## Casting

With the function '**as.()**' we convert the variable or value that we pass as argument to another data type (substituting ). 

CAUTION!!!

We must be careful with this operation, since, for example:

```r
  x <- as.numeric("Hello World!")
```

The above operation stores in the variable x the value **NA**.

## NA value

The constant **NA** is obtained in R when an operation could not be performed correctly, as in the previous section; it can also be used to designate a value we do not yet know.

## Querying information about a function

If we do not know what a function does or the arguments it receives, we can type a question mark followed by the name of that function to get all the necessary information. For example, we want to know what '**seq**' does:

```r
  ?seq
```

## Vectors

Vectors are the most basic data structure in R and the most important. Vectors can only contain one particular data type; we declare a vector as follows:

```r
  x <- c(1,2,3,4,5)
```

A vector is a one-dimensional data structure, so if we try to construct a vector of vectors R converts them to a single vector (flat).

### Access to positions of a vector

To access the positions of the vector we use square brackets as shown in the following example:

```r
v <- c(1,2,3,4,5,6,7,8,9,10)  

v[1] # We get the first element of the vector, i.e. '1'.  
v[1,4] # ERROR! The correct form is the following  

v[c(1,4)] # Get the first and fourth element of the vector  

v[1:5] # Get all elements from the first to the fifth one  

v[-c(2,3)] # We can use the '-' to access all the positions except those we don't want  

v[ v < 5 ] # Get all values smaller than 5

```

### Useful functions or expressions working with vectors

For more information about each of these functions, see the documentation.

**seq**: generates values given a start and end number. We can define the distance between numbers.

**sum**: returns the sum of all the components of the vector.

* **min or max**: returns the smallest or largest number in the vector, depending on whether we use one function or the other.

* **unique**: given a vector returns it without repeated components.

**rev**: returns the vector with the components in reverse order.

* **order**: returns the positions in which the components of the vector should go to be ordered.

* **sample**: used to obtain a series of random values from a vector.

* The expression **1:10** generates the sequence of numbers from 1 (initial value) to 10 (final value). We can use this expression to generate any sequence of values we want.