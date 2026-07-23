# Context

[Numpy's ndarrays](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html) are a very useful data structure, used everywhere from training AI models to unpacking data for astronomy. It implements a very well thought out version of matrices, with some extra useful properties.

With that said, any programmer who has an intermediate understanding of programming and math knows that an array is basically a matrix.

#### 2d matrix 
![[Pasted image 20260711014943.png]]

#### 2d array 
![[Pasted image 20260711014814.png]]

are functionally equivalent.

But life is not that simple. We tend to categorise complex data into categories, and associate it with different things. So a situation may arise when you are dealing with a weirdly nested array.

![[Pasted image 20260711015330.png]]

Like we established before, arrays are just matrices.

![[Pasted image 20260711015854.png]]

But how do you retain the logical partitions such as the pairs and the rows? This array is stored into memory as a contiguous block of memory.

You use what's called a stride. A stride allows you to make jumps in a higher dimension.

![[Pasted image 20260711020252.png|453]]

Here's what that actually looks like for the nested example above:

```python
>>> arr.shape
(3, 2, 2)
>>> arr.strides
(32, 16, 8)
```

Each number is bytes to skip to move one step along that axis. To move to the next row (axis 0), jump 32 bytes. To move to the next pair (axis 1), jump 16 bytes. To move to the next element (axis 2), jump 8 bytes — one `int64`.

To find `arr[1][0][1]` in the underlying memory buffer:

```
offset = 1*strides[0] + 0*strides[1] + 1*strides[2]
       = 1*32 + 0*16 + 1*8
       = 40 bytes
```

Jump 40 bytes into the flat buffer, read 8 bytes, and that's your element. No nested loops, no recursion — just arithmetic on a flat block of memory.

