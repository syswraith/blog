
A **cipher** is an algorithm for encoding or decoding text in such a way that only the intended recipient can understand it.  

![[input_output_map.png]]

At a high level, all cryptographic algorithms work as follows:

1. The unencrypted message is called **plaintext**.  
2. Plaintext is passed to an **encryption function**, which is a set of rules for transforming the message.  
3. The function also takes a **key**, known only to the sender and receiver.  
4. Using the key, the function produces the **ciphertext** (encrypted message).  

It is crucial that the key and encryption method remain secret; otherwise, anyone can decrypt the message.

---

## The Ciphertext

We are given the following ciphertext

```
psili nli cg bgli onllailm pg flgmm. nkk a snvi ac fgbbgc waps psi qcfgcplgkknoki ncr psi acmnci, psi vafagqm ncr psi ivak, nkk psi bnysib a snvi fnqmir ncr by qppil acraeeilicfi pgwnlr ap a snvi cgw mqlhnmmir. by hnac am fgcmpncp ncr msnlh ncr a rg cgp sghi egl n oippil wglkr egl ncygci, ac enfp a wncp by hnac pg oi acekafpir gc gpsilm. a wncp cg gci pg imfnhi, oqp ivic nepil nrbappacd psam psili am cg fnpsnlmam, by hqcamsbicp fgcpacqim pg ikqri bi ncr a dnac cg riihil ucgwkirdi ge bymike; cg ciw ucgwkirdi fnc oi ixplnfpir elgb by pikkacd. psam fgceimmagc snm bincp cgpsacd.
```

Uppercase letters denote letters that are decrypted and lowercase letters denote letters that are not. 

---
## Step 1: Initial Guesses

![[word_frequency.png]]

Observing the text, we notice **frequent repetitions** such as `psi` and `ncr` 
. We can guess 2 common 3-letter words:  

| Cipher | Likely Plaintext |
| ------ | ---------------- |
| psi    | THE              |
| ncr    | AND              |

Let's assign them:

```
p => T
s => H
i => E
n => A
c => N
r => D
```
![[cipher_1.png]]
In the first word, if we change `l` => `R`, we get the word `THERE`.  
In the second word, if we change `n` => `A`, we get the word `ARE`.  

```
l => R
n => A
```
![[cipher_2.png]]

---
## Step 2: Single-character Words

The character `a` comes by itself. There are two possibilities — `A` and `I`. Since `A` is already used, we replace it with:

```
a => I
```
![[cipher_3.png]]

---
## Step 3: Recognizing Common Words

The phrase `AND` appears in context; we assign:

```
v => V
w => W
c => N
r => D
```
![[cipher_4.png]]
We can assume that since since v, w have their usual meanings, the letters coming after them follow this property as well.

```
x => X
y => Y
z => Z
```

---
## Step 4: Repeating Letters

- Repeated ciphertext `kk` likely is likely `ll` because ALL fits more in this context than ASS.  
- `m` → `S` to form the word `INSANE`.  
![[cipher_5.png]]

---
## Step 5: Completing the Key

Based on context, we fill remaining letters:

```
g => O
b => M
o => B
q => U
h => P
d => G
f => C
e => F
```

![[cipher_6.png]]

---
## Final Key

| Letter  | a   | b   | c   | d   | e   | f   | g   | h   | i   | j   | k   | l   | m   | n   | o   | p   | q   | r   | s   | t   | u   | v   | w   | x   | y   | z   |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mapping | I   | M   | N   | G   | F   | C   | O   | P   | E   | _   | _   | R   | S   | A   | B   | T   | U   | D   | H   | _   | _   | V   | W   | X   | Y   | Z   |


---
## Step 6: Frequency Analysis & Observations

- Observing repeating letters and common patterns (`THE`, `ARE`, `AND`) helped identify substitutions.  
- Double letters (`ll`, `ss`) give clues about word structure.  
- Context is key: guessing likely words makes solving faster.
---
## Tips for Solving Substitution Ciphers

1. **Start with short, common words** (`the`, `and`, `are`, `is`).  
2. **Look for repeating patterns** — double letters, common suffixes (`-ing`, `-ed`).  
3. **Track mappings in a table.** Sometimes one may be able to bruteforce the key used to encrypt the message, and then break the cipher that way.
4. **Analyze the frequency of letters.** For example, letters like `E`, `T`, `A` appear often in English.
5. A good resource for more information on cryptography is **The Code Book by Simon Singh**.