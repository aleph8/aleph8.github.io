---
id: 15082023
group: Mathematics
specialty: quantum
author: Alejandro García Peláez
date: "15-08-2023"
tags: [ "knowledge" ]
title: Math basis
---

:::::{.spanish}
**Aún quedan elementos por añadir**

- [Matemática fundamental en mecánica cuántica](#matemática-fundamental-en-mecnica-cuántica)<br>
	- [Teoría de Matrices](#teoría-de-matrices)<br>
		- [Equivalencia con Teoría de Operadores](#equivalencia-con-teoría-de-operadores)<br>
		- [Matrices de Pauli](#matrices-de-pauli)<br>
	- [Álgebra abstracta](#álgebra-abstracta)<br>
		- [Sistemas algebraicos](#sistemas-algebraicos)<br>
		- [Anillo](#anillo)<br>
	- [Álgebra Linear](#álgebra-linear)<br>
		- [Espacios vectoriales](#espacios-vectoriales)<br>
		- [Zero Vector](#zero-vector)<br>
		- [Subespacio Vectorial](#subespacio-vectorial)<br>
		- [Bases y dependencia lineal](#bases-y-dependencia-lineal)<br>
		- [Operadores Lineales](#operadores-lineales)<br>
			- [Composición de operadores lineales](#composición-de-operadores-lineales)<br>
		- [Producto Interno](#producto-interno)<br>
		- [Espacio Hilbert](#espacio-hilbert)<br>
		- [Tensores](#tensores)<br>
:::::

:::::{.english}
**There are still elements to be added**

- [Mathematical knowledge for quantum mechanics](#mathematical-knowledge-for-quantum-mechanics)<br>
	- [Matrix Theory](#matrix-theory)<br>
		- [Equivalence with Operator Theory](#equivalence-with-operator-theory)<br>
		- [Pauli matrices](#pauli-matrices)<br>
	- [Abstract algebra](#abstract-algebra)<br>
		- [Algebraic systems](#algebraic-systems)<br>
		- [Ring](#ring)<br>
	- [Linear Algebra](#linear-algebra)<br>
		- [Vector spaces](#vector-spaces)<br>
		- [Zero Vector](#zero-vector)<br>
		- [Vector Subspace](#vector-subspace)<br>
		- [Bases and linear dependence](#bases-and-linear-dependence)<br>
		- [Linear Operators](#linear-operators)<br>
			- [Composition of linear operators](#composition-of-linear-operators)<br>
		- [Internal Product](#internal-product)<br>
		- [Hilbert Space](#hilbert-space)<br>
		- [Tensors](#tensors)<br>
:::::

<!-- publication with maths -->

<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<!-- publication with maths -->

:::::{.spanish}

# Matemática fundamental en mecánica cuántica

## Teoría de Matrices


### Equivalencia con Teoría de Operadores

Para entender mejor los distintos operadores podemos basarnos en su *representación matricial* que es completamente equivalente. Pero ¿cómo podemos llegar a esta conexión?.

Supongamos una matriz $A$ de dimensión $m \times n$ , podemos ver un operador lineal que "coge" un vector del espacio vectorial $C^{n}$ y "devuelve" un vector de dimensión $C^{m}$ bajo la multiplicación de la matriz $A$ por un vector en $C^{n}$.

Es decir, si cogemos la definición de operador lineal (función que es lineal en la entrada), esta es cierta siempre y cuando, la operación sea una multiplicación de $A$ (matriz) por un vector columna:

$$A \left( \sum_{i}^{}  a_i|\psi_i\rangle \right) = \sum_{i}^{} a_i A(|\psi_i\rangle)$$

¿Y como podemos obtener la representación matricial de un operador lineal? Supongamos un operador lineal:

$$A: V \rightarrow W$$

Además $|v_1\rangle, \cdots ,|v_m\rangle$ es base de $V$ y $|w_1\rangle, \cdots ,|w_m\rangle$ es base de $W$. Por cada $j$ en el rango $1, \cdots , m$ existen números complejos $A_{1j}$ a través de $A_{nj}$ tal que:

$$A|v_j\rangle = \sum_{i}^{} A_{ij}|w_i\rangle,$$

la matriz cuyos valores son $A_{ij}$ es la *representación matricial del operador A* . ¡Esta representación de $A$ es completamente equivalente a su operador $A$!

### Matrices de Pauli

Matrices fundamentales en computación cuántica, sobretodo a la hora de trabajar con circuitos y ver las transformaciones de las puertas cuánticas:

$$\sigma_{0}\equiv I \equiv \begin{bmatrix}1 & 0 \\ 0 & 1\end{bmatrix}$$

$$\sigma_{x}\equiv X \equiv \begin{bmatrix}0 & 1 \\ 1 & 0\end{bmatrix}$$

$$\sigma_{y}\equiv Y \equiv \begin{bmatrix}0 & -i \\ i & 0\end{bmatrix}$$

$$\sigma_{z}\equiv Z \equiv \begin{bmatrix}1 & 0 \\ 0 & -1\end{bmatrix}$$

La matriz $I$ suele ser omitida al ser la matriz identidad $2\times2$.

## Álgebra abstracta


### Sistemas algebraicos

Sistema matemático que consiste en un n-tupla formado por un conjunto llamado dominio, junto con una o más operaciones. Para un conjunto $C$ y un conjunto de operaciones $o_1 ... o_n$:

$$[C, o_1, ..., o_n]$$

denota el sistema.

### Anillo

Sistema algebraico formado por un dominio y dos operaciones: 'suma' y 'producto'. Estas operaciones deben cumplir unos requisitos para ser consideradas válidas.

Por ejemplo dada la terna $(C,+,\cdot)$ es un anillo donde $C$ es un conjunto y $+$ con $\cdot$ son operaciones cerradas en $C$.

## Álgebra Linear

Disciplina que se encarga de estudiar con más formalidad los espacios vectoriales y sus operaciones lineales.

### Espacios vectoriales

En resumidas cuentas, un espacio vectorial es un conjunto no vacío $V$ de objetos llamados vectores. 

Se definen dos operaciones fundamentales, la suma y el producto escalar. Es una estructura algebraica con diez axiomas fundamentales.

En cuántica los espacios vectoriales que más nos interesan son $\mathbb{C}$ y sus productos vectoriales $\mathbb{C}^n$. En este caso la operación adición es la suma básica de números complejos y lo mismo sucede con la multiplicación de un escalar.

### Zero Vector

Los espacios vectoriales también contienen un vector especial llamado 'zero vector' que para todo espacio vectorial:

$$ |\psi\rangle + 0 = |\psi\rangle $$

Respecto a la multiplicación por un escalar:

$$ 0z = 0 $$

### Subespacio Vectorial

Un subespacio vectorial $W$ es un subconjunto (no vacío) de un espacio vectorial $V$ que es también un espacio vectorial y por tanto las operaciones de adición y multiplicación escalar deben ser cerradas.

### Bases y dependencia lineal

En un espacio vectorial una base es un conjunto de vectores mediante los cuales todos los vectores del espacio se pueden obtener como combinación lineal de estos. Es usual que un espacio vectorial tenga más de una base.

Un conjunto de vectores ( sin incluir el vector cero ) es linealmente dependiente si exsite una combinación lineal ebtre ellos que los iguale a cero. Siendo $a_n$ un número complejo:

$$a_1|\psi_1\rangle + a_2|\psi_2\rangle + ... + a_n|\psi_n\rangle = 0$$

### Operadores Lineales

Un operador lineas entre dos espacios vectoriales $V$ y $W$ es cualquier función 

$$A: V \rightarrow W$$

que sea lineal en su entrada. Es decir:

$$A \left( \sum_{i}^{}  a_i|\psi_i\rangle \right) = \sum_{i}^{} a_i A(|\psi_i\rangle)$$

Cuando hablamos de un operador lineal definido en un espacio vectorial : 

$$A: V \rightarrow V$$


Un operador lineal importante (ejemplo) es el operador identidad, el cual:

$$I_{V}|\psi_i\rangle = |\psi_i\rangle,$$

$$\forall |\psi_i\rangle \in V$$

#### Composición de operadores lineales

Supongamos 3 espacios vectoriales X, W, y V con dos operadores lineales:

$$A: V \rightarrow W$$

$$B: W \rightarrow X$$

La composición viene dada por la notación $BA|\psi\rangle$

### Producto Interno

Una función $( \cdot , \cdot )$ tal que:

$$V \times V \rightarrow \mathbb{C}$$

es producto interno de un espacio complejo, si satisface:

1. Es lineal en el segundo argumento 

$$\left( |v\rangle, \sum_{i}^{} \lambda_i|w_i\rangle \right) = \sum_{i}^{} \lambda_i ( |v\rangle, |w_i\rangle  )$$

2. $( |v\rangle, |w\rangle  ) = ( |w\rangle, |v\rangle  )*$

3. $( |v\rangle, |v\rangle  ) \geqslant 0$ con igualdad sí y solo sí $|v\rangle=0$

Por ejemplo, $\mathbb{C}^n$ tiene un producto interno definido como:

$$((y_1, ... , y_n),(z_1, ... , z_n)) \equiv \sum_{i}^{} y_{i}^{*} z_{i} = [ y_{1}^{*} ... y_{n}^{*} ] \begin{bmatrix}z_{1} \\ ... \\ z_{n}\end{bmatrix}$$

### Espacio Hilbert

En una dimensión finita en los espacios vectoriales que se ven en *información y computación cuántica* un Espacio de Hilbert es lo mismo que un espacio vectorial con producto interno. (Realmente esto no es del todo así, hay una condición más, pero esto es suficiente):

>  Discussions of quantum mechanics often refer to Hilbert space. In the finite dimensional complex vector spaces that come up in quantum computation and quantum information, a Hilbert space is exactly the same thing as an inner product space. From now on we use the two terms interchangeably, preferring the term Hilbert space. In infinite dimensions Hilbert spaces satisfy additional technical restrictions above and beyond inner product spaces, which we will not need to worry about.  — M. A. Nielsen and I. Chuang. 2002. Quantum computation and quantum information. American Association of Physics Teachers. 

### Tensores

Un tensor nos permite juntar espacios vectoriales para generar otros aún más grandes. Sea $V$ y $W$ dos espacios vectoriales, definimos el tensor $V \otimes W$ como el conjunto de combinaciones lineales de los productos tensoriales $|v\rangle \otimes |w\rangle$ de los elementos $|v\rangle \in V$ y $|w\rangle \in W$.

:::::

:::::{.english}

# Mathematical knowledge for quantum mechanics

## Matrix Theory


### Equivalence with Operator Theory

To better understand the various operators we can rely on their *matrix representation* which is completely equivalent. But how can we arrive at this connection.

Suppose a matrix $A$ of dimension $m \times n$ , we can see a linear operator that "takes" a vector from vector space $C^{n}$ and "returns" a vector of dimension $C^{m}$ under the multiplication of matrix $A$ by a vector in $C^{n}$.

That is, if we take the definition of linear operator (function that is linear in the input), this is true as long as the operation is a multiplication of $A$ (matrix) by a column vector:

$$A \left( \sum_{i}^{}  a_i|\psi_i\rangle \right) = \sum_{i}^{} a_i A(|\psi_i\rangle)$$

And how can we obtain the matrix representation of a linear operator? Let's suppose a linear operator:

$$A: V \rightarrow W$$

Moreover $|v_1\rangle, \cdots ,|v_m\rangle$ is basis of $V$ and $|w_1\rangle, \cdots ,|w_m\rangle$ is basis of $W$. For every $j$ in rank $1, \cdots ,m$ there exist complex numbers $A_{1j}$ through $A_{nj}$ such that:

$$A|v_j\rangle = \sum_{i}^{} A_{ij}|w_i\rangle,$$

the matrix whose values are $A_{ij}$ is the *matrix representation of the operator A* . This representation of $A$ is completely equivalent to its operator $A$!

### Pauli matrices

Fundamental matrices in quantum computing, especially when working with circuits and seeing quantum gate transformations:

$$\sigma_{0}\equiv I \equiv \begin{bmatrix}1 & 0 \\ 0 & 1\end{bmatrix}$$

$$\sigma_{x}\equiv X \equiv \begin{bmatrix}0 & 1 \\ 1 & 0\end{bmatrix}$$

$$\sigma_{y}\equiv Y \equiv \begin{bmatrix}0 & -i \\ i & 0\end{bmatrix}$$

$$\sigma_{z}\equiv Z \equiv \begin{bmatrix}1 & 0 \\ 0 & -1\end{bmatrix}$$

The $I$ matrix is usually omitted as the $2\times2$ identity matrix.

## Abstract algebra


### Algebraic systems

A mathematical system consisting of an n-tuple formed by a set called a domain, together with one or more operations. For a set $C$ and a set of operations $o_1 ... o_n$:

$$[C, o_1, ..., o_n]$$

denota el sistema.

### Ring

Algebraic system formed by a domain and two operations: 'sum' and 'product'. These operations must meet certain requirements to be considered valid.

For example given the tern $(C,+,\cdot)$ is a ring where $C$ is a set and $+$ with $\cdot$ are closed operations on $C$.

## Linear Algebra

Discipline that deals with the more formal study of vector spaces and their linear operations.

### Vector spaces

Briefly, a vector space is a nonempty set $V$ of objects called vectors. 

Two fundamental operations are defined, the sum and the scalar product. It is an algebraic structure with ten fundamental axioms.

In quantum the vector spaces we are most interested in are $\mathbb{C}$ and their vector products $\mathbb{C}^n$. In this case the addition operation is the basic addition of complex numbers and so is the multiplication of a scalar.

### Zero Vector

Vector spaces also contain a special vector called a 'zero vector' that for every vector space:

$$ |\psi\rangle + 0 = |\psi\rangle $$

Regarding multiplication by a scalar:

$$ 0z = 0 $$

### Vector Subspace

A vector subspace $W$ is a (non-empty) subset of a vector space $V$ which is also a vector space and therefore addition and scalar multiplication operations must be closed.

### Bases and linear dependence

In a vector space a basis is a set of vectors by which all the vectors of the space can be obtained as a linear combination of these. It is usual for a vector space to have more than one basis.

A set of vectors (not including the zero vector) is linearly dependent if there exists a linear combination between them that equals zero. Being $a_n$ a complex number:

$$a_1|\psi_1\rangle + a_2|\psi_2\rangle + ... + a_n|\psi_n\rangle = 0$$

### Linear Operators

A linear operator between two vector spaces $V$ and $W$ is any function

$$A: V \rightarrow W$$

that is linear in its input. That is to say:

$$A \left( \sum_{i}^{}  a_i|\psi_i\rangle \right) = \sum_{i}^{} a_i A(|\psi_i\rangle)$$

When we speak of a linear operator defined on a vector space:

$$A: V \rightarrow V$$

An important linear operator (example) is the identity operator, which:

$$I_{V}|\psi_i\rangle = |\psi_i\rangle,$$

$$\forall |\psi_i\rangle \in V$$

#### Composition of linear operators

Suppose 3 vector spaces X, W, and V with two linear operators:

$$A: V \rightarrow W$$

$$B: W \rightarrow X$$

The composition is given by the notation $BA|\psi\rangle$

### Internal Product

A function $( \cdot , \cdot )$ such that:

$$V \times V \rightarrow \mathbb{C}$$

is an inner product of a complex space, if it satisfies:

1. It is linear in the second argument

$$\left( |v\rangle, \sum_{i}^{} \lambda_i|w_i\rangle \right) = \sum_{i}^{} \lambda_i ( |v\rangle, |w_i\rangle  )$$

2. $( |v\rangle, |w\rangle  ) = ( |w\rangle, |v\rangle  )*$

3. $( |v\rangle, |v\rangle  ) \geqslant 0$ with equality if and only if $|v\rangle=0$

For example, $\mathbb{C}^n$ has an inner product defined as: 

$$((y_1, ... , y_n),(z_1, ... , z_n)) \equiv \sum_{i}^{} y_{i}^{*} z_{i} = [ y_{1}^{*} ... y_{n}^{*} ] \begin{bmatrix}z_{1} \\ ... \\ z_{n}\end{bmatrix}$$

### Hilbert Space

In a finite dimension in the vector spaces seen in *quantum information and computation* a Hilbert Space is the same as a vector space with inner product. (Actually this is not quite so, there is one more condition, but this is enough):

>  Discussions of quantum mechanics often refer to Hilbert space. In the finite dimensional complex vector spaces that come up in quantum computation and quantum information, a Hilbert space is exactly the same thing as an inner product space. From now on we use the two terms interchangeably, preferring the term Hilbert space. In infinite dimensions Hilbert spaces satisfy additional technical restrictions above and beyond inner product spaces, which we will not need to worry about.  — M. A. Nielsen and I. Chuang. 2002. Quantum computation and quantum information. American Association of Physics Teachers. 

### Tensors

A tensor allows us to put together vector spaces to generate even larger ones. Let $V$ and $W$ be two vector spaces, we define the tensor $V Òtimes W$ as the set of linear combinations of the tensor products. $|v\rangle \otimes |w\rangle$ de los elementos $|v\rangle \in V$ y $|w\rangle \in W$.

:::::