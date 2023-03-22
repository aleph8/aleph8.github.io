--- 
aliases: 
author: Alejandro García Peláez 
categories: 
- Cybersecurity 
date: "2022-11-02" 
description: 
image: 
series: 
tags: 
- cryptography 
title: Universal Caesar Encryption 
--- 

As we have already seen in [Digging into Cryptography](/en/p/2022/digging-into-cryptography/), cryptology is a very broad field composed of four essential pillars.

Cryptography is mostly focused on the algorithms we use to protect information; this time we are going to look at a classical encryption method, namely by monoalphabetic substitution (standard alphabet monogramming).

This cipher was used by Julius Caesar himself to communicate his important messages securely (specifically with a 3-position shift).

To encrypt a word using this method we must first choose an offset, which will be the positions we will move to the right in the alphabet in question. For example: if we choose offset 1 and we want to encrypt "**ABC**" the result would be "**BCD**".

Below, you can see an implementation of this cipher, to encrypt any string (without spaces, consecutive words and only letters, since we are talking about an alphabet) and decrypt any encrypted string, even without knowing the offset.

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
