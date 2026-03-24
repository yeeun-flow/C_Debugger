#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main(void)
{
	int i, sum, max;
	printf("양의 정수 입력 >> ");
	scanf("%d", &max);

	for (i = 1, sum = 0; i <= max; i++) //++i도 가능
		sum += i; // sum = sum + i;
	printf("\nfor 문으로 구한 1에서 %d까지 합: %3d\n", max, sum);

	i = 1, sum = 0;
	while (i <= max)
	{
		sum += i;	// sum = sum + i;
		i++;		// ++i도 가능
	}
	printf("while 문으로 구한 1에서 %d까지 합: %3d\n", max, sum);

	return 0;
}
