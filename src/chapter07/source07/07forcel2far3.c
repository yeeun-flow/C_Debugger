#include <stdio.h>
#define MAX 3
#define INCREMENT 10

int main(void)
{
	double celsius = 12.46;

	printf("  ¼·¾¾(C)  È­¾¾(F)\n");
	for (int i = 1; i <= MAX; i++, celsius += INCREMENT)
	{
		printf("%8.2f %8.2f\n", celsius, 9.0 / 5 * celsius + 32);
	}

	return 0;
}
