#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main()
{
	int num, j;
	printf("2 이상 양의 정수 입력 >> ");
	scanf("%d", &num);

	for (j = 2; j < num; j++)
		if (num % j == 0)
			break;

	if (j == num)
		printf("%d 소수이다.\n", num); 
	else 
		printf("%d 소수가 아니다.\n", num);

	return 0;
}
