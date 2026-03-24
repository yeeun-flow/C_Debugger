#include <stdio.h>

int main(void)
{
	int i, sum;
	for (i = 1, sum = 0; i <= 10; i++) //++i도 가능
		sum += i; // sum = sum + i;
	printf("1 ~ 10 합: %d\n", sum);

	for (i = 1, sum = 0; i <= 10; )
		sum += i++;
	printf("1 ~ 10 합: %d\n", sum);

	for (i = 0, sum = 0; i <= 9; )
		sum += ++i;
	printf("1 ~ 10 합: %d\n", sum);

	for (i = 1, sum = 0; i <= 10; sum += i++); //반복 몸체가 없는 for 문
	printf("1 ~ 10 합: %d\n", sum);
	for (i = 0, sum = 0; i <= 9; sum += ++i); //반복 몸체가 없는 for 문
	printf("1 ~ 10 합: %d\n", sum);

	return 0;
}
