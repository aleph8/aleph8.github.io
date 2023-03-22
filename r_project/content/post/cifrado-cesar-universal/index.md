--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Ciberseguridad 
date: "2022-11-02" 
description: 
image: 
series: 
tags: 
- criptografía 
title: Cifrado César Universal 
--- 

Como ya hemos visto en [Indagando en la Criptografía](/p/2022/indagando-en-la-criptografía), la criptología es un campo muy amplio compuesto por cuatro pilares esenciales.

La criptografía se centra mayoritariamente en los algoritmos que empleamos para proteger la información; en esta ocasión vamos a ver un método de cifrado clásico, concretamente por sustitución monoalfabética (monográmica de alfabeto estándar).

Este cifrado se empleaba por el propio Julio César para comunicar sus mensajes importantes de forma segura (concretamente con un desplazamiento de 3 posiciones).

Para cifrar una palabra utilizando este método debemos elegir en primer lugar un desplazamiento, que serán las posiciones que nos moveremos hacia la derecha en el abecedario en cuestión. Por ejemplo: si elegimos desplazamiento 1 y queremos cifrar "**ABC**" el resultado sería "**BCD**".

A continuación, podéis ver una implementación de este cifrado, para cifrar cualquier cadena (sin espacios, palabras seguidas y solo letras, ya que estamos hablando de un abecedario) y descifrar cualquier cadena cifrada, incluso sin saber el desplazamiento.

```python
#!/usr/bin/env python3

########################################################
# aleph8                                               #
#------------------------------------------------------#
# Universal Caesar Cipher and Decipher                 #
#------------------------------------------------------#
#                                                      #
########################################################

def cipher():

  text=input("Insert the text: ")
  cipher=int(input("Insert the displacement: "))
  result=""
  # ord("A") = 65, ord("Z") = 90, ord("a") = 97, ord("z") = 122
  # ord(i) => "Given a string representing one Unicode character, return an integer representing the Unicode code"
  # chr(i) => "Return the string representing a character whose Unicode code point is the integer i"

  for i in text:
    tmp=ord(i)
    if ( tmp >= 65 and tmp <= 90 ) or ( tmp >= 97 and tmp <= 122 ):
      if ( tmp >= 65 and tmp <= 90 ):
        result+=chr((tmp-65+cipher)%26+65)
      else:
        result+=chr((tmp-97+cipher)%26+97)
    else:
      print("ERROR: INVALID CHARACTER")

  print(result)

def decipher(n,text):

  result=""

  for i in text:
    tmp=ord(i)
    if ( tmp >= 65 and tmp <= 90 ) or ( tmp >= 97 and tmp <= 122 ):
      if ( tmp >= 65 and tmp <= 90 ):
        result+=chr((tmp-65-n)%26+65)
      else:
        result+=chr((tmp-97-n)%26+97)
    else:
      print("ERROR: INVALID CHARACTER")

  print("Caesar(%d):%s\n" % (n,result))

mode=int(input("""OPTIONS

\t0)Cipher
\t1)Decipher

Choose one of them (0 or 1): """))

if mode == 0:
  cipher()
elif mode == 1:
  text=input("Insert the text: ")
  yn=input("Do you know the displacement?(y/n): ")
  if yn == "y":
    ciphern=int(input("Insert the displacement: "))
    decipher(ciphern,text)
  elif yn == "n":
    for i in range(27):
      decipher(i,text)
  else:
    print("[x]Invalid option!")
    exit(255)
else:
  print("[x]Invalid option!")
  exit(255)
```
