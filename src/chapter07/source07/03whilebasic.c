#include <stdio.h>

int main(void)
{
	int count = 1;

	while (count <= 3)
	{
		printf("반복, 재미있네요!\n");
		count++;
	};
	printf("\n제어 변수 count => %d\n", count);

	return 0;
}
