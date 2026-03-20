#include <stdio.h> 

int main(void)
{
	int count = 1;

loop:
	printf("%3d", count);
	if (++count <= 10)
		goto loop;

	printf("\n종료\n");

	return 0;
}
