#include <iostream> 

int main() {
    int num1, num2, sum;
    std::cin >> num1;
    std::cin >> num2;

    sum = num1 + num2;

    std::cout << "The sum of " << num1 << " and " << num2 << " is: " << sum << std::endl;

    return 0; 
}