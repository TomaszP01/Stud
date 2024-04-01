import numpy as np
import matplotlib.pyplot as plt

# Variables
a =  1.0
b =  1.0
c =  1.0

# Function
def TwoInputFunction(x, y):
  z = a*x + b*y + c
  return z

# Scope
scope_start     = -10
scope_end       =  10
scope_points    =  200
scope           =  np.linspace(scope_start, scope_end, scope_points)

# Ploting
X     = scope
Y     = X
Z     = np.zeros([scope_points,scope_points])

for i in range(0, scope_points, 1):
    for j in range(0, scope_points, 1):
        Z[i,j] = TwoInputFunction(X[i],Y[j])

fig = plt.figure(figsize=(8, 8))
ax = fig.add_subplot(111, projection='3d')
X, Y = np.meshgrid(X, Y)
surf = ax.plot_surface(X, Y, Z, cmap='cool')                      # 'viridis'

ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
plt.show()
