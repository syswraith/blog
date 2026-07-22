
# Context

[Numpy's ndarrays](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html) are a very useful data structure, used everywhere from training AI models to unpacking data for astronomy. It's implements a very well thought out version of matrices, with some extra useful properties. 

With that said, any programmer who has an intermediate understanding of programming and math knows that an array is basically a matrix.

2d matrix

![[Pasted image 20260711014943.png]]

2d array

![[Pasted image 20260711014814.png]]

are functionally equivalent.

But life is not that simple. We tend to categorise complex data into categories, and associate it with different things. So a situation may arise when you are dealing with a weirdly nested array.

![[Pasted image 20260711015330.png]]

like we established before, arrays are just matrices. 

![[Pasted image 20260711015854.png]]

but how do you retain the logical partitions such as the pairs and the rows? this array is stored into memory as a contiguous block of memory. 

you use, what's called a stride. a stride allows you to make jumps in a higher dimension.


![[Pasted image 20260711020252.png|453]]

