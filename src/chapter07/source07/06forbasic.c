#include <stdio.h>
#define MAX 5

int main(void)
{
	int i;
	for (i = 1; i <= MAX; i++)
		printf("반복 %d\n", i);

	printf("\nfor 종료 이후 i => %d\n", i);

	return 0;
}
