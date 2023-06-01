import hickle as hkl
import numpy as np
import nnet as net
# import nnet_jit as net
import matplotlib.pyplot as plt 
from sklearn.model_selection import StratifiedKFold

class mlp_a_3w:
    def __init__(self, x, y_t, K1, K2, K3, lr, err_goal, \
                 disp_freq, ksi_inc, ksi_dec, er, max_epoch):
        self.x          = x
        self.L          = self.x.shape[1] 
        self.y_t        = y_t
        self.K1         = K1
        self.K2         = K2
        self.K3         = K3
        self.lr         = lr
        self.err_goal   = err_goal
        self.disp_freq  = disp_freq
        self.ksi_inc    = ksi_inc
        self.ksi_dec    = ksi_dec
        self.er         = er
        self.max_epoch  = max_epoch

        self.SSE_vec = [] 
        self.PK_vec = []

        self.w1, self.b1 = net.nwtan(self.K1, self.L)  
        self.w2, self.b2 = net.nwtan(self.K2, self.K1)
        self.w3, self.b3 = net.rands(self.K3, self.K2)
        # hkl.dump([self.w1,self.b1,self.w2,self.b2,self.w3,self.b3], 'wagi3w.hkl')
        # self.w1,self.b1,self.w2,self.b2,self.w3,self.b3 = hkl.load('wagi3w.hkl')
        self.SSE = 0
        self.lr_vec = list()
    
    def predict(self,x):
        n = np.dot(self.w1, x)
        self.y1 = net.tansig( n,  self.b1*np.ones(n.shape)) 
        n = np.dot(self.w2, self.y1)
        self.y2 = net.tansig( n,  self.b2*np.ones(n.shape))
        n = np.dot(self.w3, self.y2)
        self.y3 = net.purelin(n, self.b3*np.ones(n.shape)) 
        return self.y3
        
    def train(self, x_train, y_train):
        for epoch in range(1, self.max_epoch+1): 
            self.y3 = self.predict(x_train)    
            self.e = y_train - self.y3 
        
            self.SSE_t_1 = self.SSE
            self.SSE = net.sumsqr(self.e) 
            self.PK = (1 - sum((abs(self.e)>=0.5).astype(int)[0])/self.e.shape[1] ) * 100
            self.PK_vec.append(self.PK)
            if self.SSE < self.err_goal or self.PK == 100: 
                break 
            
            if np.isnan(self.SSE): 
                break
            else:
                if self.SSE > self.er * self.SSE_t_1:
                    self.lr *= self.ksi_dec
                elif self.SSE < self.SSE_t_1:
                    self.lr *= self.ksi_inc
            self.lr_vec.append(self.lr)
            
            self.d3 = net.deltalin(self.y3, self.e) 
            self.d2 = net.deltatan(self.y2, self.d3, self.w3)
            self.d1 = net.deltatan(self.y1, self.d2, self.w2) 
            self.dw1, self.db1 = net.learnbp(self.x.T,  self.d1, self.lr) 
            self.dw2, self.db2 = net.learnbp(self.y1, self.d2, self.lr)
            self.dw3, self.db3 = net.learnbp(self.y2, self.d3, self.lr)
            
            self.w1 += self.dw1 
            self.b1 += self.db1  
            self.w2 += self.dw2  
            self.b2 += self.db2 
            self.w3 += self.dw3  
            self.b3 += self.db3  
            
            self.SSE_vec.append(self.SSE) 
            
    def train_CV(self, CV, skfold):
        for i, (train, test) in enumerate(skfold.split(data, np.squeeze(target)), start=0):
            x_train, x_test = data[train], data[test]
            y_train, y_test = np.squeeze(target)[train], np.squeeze(target)[test]
            
            mlpnet = mlp_a_3w(x_train, y_train, self.K1, self.K2, K3, lr, err_goal, \
                             disp_freq, self.ksi_inc, self.ksi_dec, self.er,max_epoch)
            mlpnet.train(x_train.T, y_train.T)
            result = mlpnet.predict(x_test.T)

            n_test_samples = test.size
            PK_vec[i] = sum((abs(result - y_test)<0.5).astype(int)[0])/n_test_samples * 100
            
            PK = np.mean(PK_vec)
            return PK
        
x,y_t,x_norm,x_n_s,y_t_s = hkl.load('glass.hkl')

max_epoch = 3000
err_goal = 0.25
disp_freq = 300
lr = 1e-3

data = x_n_s.T
target = y_t_s
K3 = target.shape[0]

CVN = 10
skfold = StratifiedKFold(n_splits=CVN)
PK_vec = np.zeros(CVN)

#--------Wartosci K1 oraz K2 do testów--------
K1_vec = np.array([1,3,5,7,9])
K2_vec = K1_vec

PK_2D_K1K2 = np.zeros([len(K1_vec),len(K2_vec)])

PK_2D_K1K2_max = 0
k1_ind_max = 0 
k2_ind_max = 0

#--------Wartosci ksi_inc oraz ksi_dec do testów--------
ksi_inc_vec = np.array([0.90, 1.00, 1.05, 1.10, 1.20])
ksi_dec_vec = np.array([0.60, 0.65, 0.70, 0.75, 0.80])

PK_2D_IncDec = np.zeros([len(ksi_inc_vec),len(ksi_dec_vec)])

PK_2D_IncDec_max = 0
ksi_inc_ind_max = 0 
ksi_dec_ind_max = 0

#--------Wartosci er do testów--------
er_vec = np.array([1.00, 1.02, 1.04, 1.06, 1.10])

PK_er = np.zeros([len(er_vec)])

PK_er_max = 0
er_ind_max = 0 

for k1_ind in range(len(K1_vec)):
    for k2_ind in range(len(K2_vec)):
        mlpnet = mlp_a_3w(x_norm, y_t, K1_vec[k1_ind], K2_vec[k2_ind], K3, lr, err_goal, 
                          disp_freq, ksi_inc_vec[2], ksi_dec_vec[2], er_vec[2], max_epoch)
        PK = mlpnet.train_CV(CVN, skfold)
        print("K1 {} | K2 {} | PK {}". format(K1_vec[k1_ind], K2_vec[k2_ind], PK))
        PK_2D_K1K2[k1_ind, k2_ind] = PK
        if PK > PK_2D_K1K2_max:
            PK_2D_K1K2_max = PK
            k1_ind_max = k1_ind 
            k2_ind_max = k2_ind

fig = plt.figure(figsize=(8, 8))
ax1 = fig.add_subplot(111, projection='3d')
X, Y = np.meshgrid(K1_vec, K2_vec)
surf = ax1.plot_surface(X, Y, PK_2D_K1K2.T, cmap='viridis')

ax1.set_xlabel('K1')
ax1.set_ylabel('K2')
ax1.set_zlabel('PK')

for ksi_inc_ind in range(len(ksi_inc_vec)):
    for ksi_dec_ind in range(len(ksi_dec_vec)):
        mlpnet = mlp_a_3w(x_norm, y_t, K1_vec[k1_ind_max], K2_vec[k2_ind_max], K3, lr, err_goal, 
                          disp_freq, ksi_inc_vec[ksi_inc_ind], ksi_dec_vec[ksi_dec_ind], er_vec[2], max_epoch)
        PK = mlpnet.train_CV(CVN, skfold)
        print("ksi_inc {} | ksi_dec {} | PK {}". format(ksi_inc_vec[ksi_inc_ind], ksi_dec_vec[ksi_dec_ind], PK))
        PK_2D_IncDec[ksi_inc_ind, ksi_dec_ind] = PK
        if PK > PK_2D_IncDec_max:
            PK_2D_IncDec_max = PK
            ksi_inc_ind_max = ksi_inc_ind
            ksi_dec_ind_max = ksi_dec_ind

fig = plt.figure(figsize=(8, 8))
ax2 = fig.add_subplot(111, projection='3d')
X, Y = np.meshgrid(ksi_inc_vec, ksi_dec_vec)
surf = ax2.plot_surface(X, Y, PK_2D_IncDec.T, cmap='cool')

ax2.set_xlabel('ksi_inc')
ax2.set_ylabel('ksi_dec')
ax2.set_zlabel('PK')

for er_ind in range(len(er_vec)):
    mlpnet = mlp_a_3w(x_norm, y_t, K1_vec[k1_ind_max], K2_vec[k2_ind_max], K3, lr, err_goal, 
                      disp_freq, ksi_inc_vec[ksi_inc_ind_max], ksi_dec_vec[ksi_dec_ind_max], er_vec[er_ind], max_epoch)
    PK = mlpnet.train_CV(CVN, skfold)
    print("er {} | PK {}". format(er_vec[er_ind], PK))
    PK_er[er_ind] = PK
    if PK > PK_er_max:
        PK_er_max = PK
        er_ind_max = ksi_inc_ind

fig = plt.figure(figsize=(8, 8))
ax3 = fig.add_subplot(111)
ax3.set_xlabel('er')
ax3.set_ylabel('PK')
ax3.plot(er_vec, PK_er)

print("OPTYMALNE WARTOŚCI: K1={} | K2={} | ksi_inc={} | ksi_dec={} | er={} | PK={}". 
      format(K1_vec[k1_ind_max], K2_vec[k2_ind_max],
             ksi_inc_vec[ksi_inc_ind_max], ksi_dec_vec[ksi_dec_ind_max], 
             er_vec[er_ind_max], PK_2D_IncDec_max))
