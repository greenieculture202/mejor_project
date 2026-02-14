#!/usr/bin/env python3
"""
Simple Python program demo.
- Enter numbers to get count, sum, average, min, max.
- Optionally compute factorial of a non-negative integer.
"""

def main():
    print("Simple Utility: sum/average/min/max and factorial demo.")
    nums = input("Enter numbers separated by space (or press Enter to skip): ").strip()
    if nums:
        try:
            nums_list = [float(x) for x in nums.split()]
            print(f"Count: {len(nums_list)}")
            print(f"Sum: {sum(nums_list)}")
            print(f"Average: {sum(nums_list)/len(nums_list)}")
            print(f"Min: {min(nums_list)}")
            print(f"Max: {max(nums_list)}")
        except ValueError:
            print("One or more inputs were not valid numbers.")

    n = input("Enter a non-negative integer to compute factorial (or press Enter to exit): ").strip()
    if n:
        try:
            n_int = int(n)
            if n_int < 0:
                print("Factorial undefined for negative numbers.")
            else:
                print(f"{n_int}! = {factorial(n_int)}")
        except ValueError:
            print("Invalid integer input.")


def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


if __name__ == "__main__":
    main()
