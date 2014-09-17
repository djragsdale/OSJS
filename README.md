OSJS
====

A mock CLI OS written entirely in javascript. Doesn't mock up real computer memory, but mimics the basic functions.

Requirements:
1. [+] OS ust have a filesystem which can use basic CRUD functions on files.
2. [+] Filesystem must be navigable.
3. [ ] Filesystem must be user-maintainable (remove directories, create new files, etc.).
4. [+] OS must be able to run programs written in a language other than assembly.
5. [ ] There must be a program which can compile basic programs from at least 1 major programming language to a program the OS can run.
6. [-] There must be a program that can edit and save text documents.
	Note: Currently edits documents but cannot save those documents.
7. [-] OS must be able to evaluate complex expressions containing the basic operators ('()', *, /, +, -, concatenation) following the order of operations.
	Note: Currently works as long as there are no negative numbers. Uses a custom coded recursive descent parser. Does not do concatenation yet.
8. [-] OS must accept batch scripting files which take in parameters, understand variables, and rudimentary loops.
	Note: Current accepts parameters and variables, but operates under the BATCH program instead of executing each command after variable/parameter replacement.
