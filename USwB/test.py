import numpy as np

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

large_data_set = np.random.randint(1, 1000000, size=1000000)    # Generowanie dużego zestawu danych

with open('to_sort.txt', 'w') as file:                          # Zapisywanie danych do pliku 'to_sort.txt'
    file.write('\n'.join(map(str, large_data_set)))

with open('to_sort.txt', 'r') as file:                          # Odczyt danych z pliku 'to_sort.txt'
    loaded_data = list(map(int, file.read().splitlines()))

bubble_sort(loaded_data)                                        # Wywołanie funkcji sortującej na wczytanych danych

with open('sorted.txt', 'w') as file:                           # Zapisywanie posortowanych danych do pliku 'sorted.txt'
    file.write('\n'.join(map(str, loaded_data)))
