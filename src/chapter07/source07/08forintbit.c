#include <stdio.h>
#define TOTAL_BIT 32

int main(void)
{
	int num = 13;
	printf("%d의 %d비트 내부 값:\n", num, TOTAL_BIT);

	for (int i = TOTAL_BIT - 1; i >= 0; i--)
		printf("%d", num >> i & 1);
	printf("\n");

	return 0;
}
