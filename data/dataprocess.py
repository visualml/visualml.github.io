import numpy as np

file = "cifar/x.npy"
newfile = "cifar/x.js"
x = np.load(file)[:3400]
print(len(x))

with open(newfile, 'w') as f:
    shape = x.shape
    x = x.flatten()
    # x.tofile(f, ",")
    # f.seek(0)
    f.write("data_y = tf.tensor([")
    for i in range(len(x)-1):
        f.write(str(x[i]) + ",")
    f.write(str(x[-1]))
    # f.seek(0, 2)
    f.write("]," + "[3400,32,32,3]" + ")")


# np.savetxt(directory+"/x.js", x, delimiter=',')
# np.savetxt(directory+"/y.js", x, delimiter=',')