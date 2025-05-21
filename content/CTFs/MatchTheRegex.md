
Tags: #Medium #WebExploitation #picoCTF2023

1. Launch the instance
![[Pasted image 20250521111621.png]]
2. Open the URL
![[Pasted image 20250521112026.png]]
3. On inspecting the source code, we can see that the input text of the form is being validated by `fetch()` with a get request to the `/flag` endpoint.
![[Pasted image 20250521112156.png]]
4. Not really a regex match but we'll try matching the known first characters of a flag, i.e. `picoCTF`. And it works!

![[Pasted image 20250521112333.png]]
