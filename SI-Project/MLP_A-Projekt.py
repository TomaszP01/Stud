import hickle as hkl					                                          # Biblioteka do obsługi plików binarnych
import numpy as np					                                              # Biblioteka do obliczeń naukowych i numerycznych
import nnet as net					                                              # Biblioteka zawierająca funkcje sieci neuronowych
import matplotlib.pyplot as plt 			                                      # Biblioteka do tworzenia wykresów
from sklearn.model_selection import StratifiedKFold                               # Klasa do podziału danych na zbiory testowe oraz treningowe
                                                                                  # Linie 1-5: implementacja bibliotek i metod
class mlp_a_3w:
    def __init__(self, x, y_t, K1, K2, lr, err_goal,  
                 disp_freq, ksi_inc, ksi_dec, er, max_epoch):                     # Linia 8-9: Inicjalizacja konstruktora klasy z przekazanymi argumentami
        self.x          = x			                                              # Dane wejściowe
        self.L          = self.x.shape[0] 	                                      # Liczba cech wejściowych
        self.y_t        = y_t			                                          # Oczekiwane dane wyjściowe
        self.K1         = K1			                                          # Liczba neuronów w pierwszej warstwie ukrytej
        self.K2         = K2			                                          # Liczba neuronów w drugiej warstwie ukrytej
        self.K3         = y_t.shape[0]		                                      # Liczba neuronów w warstwie wyjściowej
        self.lr         = lr			                                          # Współczynnik uczenia (wpływa na tempo aktualizacji wag sieci)
        self.err_goal   = err_goal		                                          # Wartość błędu, której chcemy osiągnąć w trakcie uczenia
        self.disp_freq  = disp_freq		                                          # Częstotliwość wyświetlania informacji o postępie uczenia
        self.ksi_inc    = ksi_inc		                                          # Wartość o jaką zwiększane są wagi pozytywnie wpływające na wynik
        self.ksi_dec    = ksi_dec		                                          # Wartość o jaką zmniejszane są wagi negatywnie wpływające na wynik
        self.er         = er			                                          # Procentowy limit błędu, który determinuje koniec uczenia
        self.max_epoch  = max_epoch		                                          # Maksymalna liczba epok (iteracji) uczenia
        self.data       = self.x.T		                                          # Dane wejściowe przekształcone (transponowane)
        self.target     = self.y_t		                                          # Oczekiwane dane wyjściowe
        self.SSE_vec    = [] 			                                          # Wektor przechowujący wartości błędu SSE w kolejnych epokach
        self.PK_vec     = []			                                          # Wektor przechowujący wartości błędu PK w kolejnych epokach

        self.w1, self.b1 = net.nwtan(self.K1, self.L)  
        self.w2, self.b2 = net.nwtan(self.K2, self.K1)
        self.w3, self.b3 = net.rands(self.K3, self.K2)
                                                                                  # Linie 28-30: inicjalizacja wag
        self.SSE = 0    				                                          # Zainicjowanie sumy kwadratów błędów
        self.lr_vec = list()			                                          # Stworzenie pustej listy dla współczynników uczenia
                                                                                  # Linie 10-34: zdefiniowanie parametrów klasy
   
    def predict(self,x):		                                                  # Funkcja obliczająca wartość wyjściową sieci neuronowej dla podanego wektora wejściowego x poprzez przekształcenie go przez warstwy sieci
        n = np.dot(self.w1, x)		                                              # Obliczanie iloczynu skalarnego warstwy 1 i danymi wejściowymi		
        self.y1 = net.tansig( n,  self.b1*np.ones(n.shape))                       # Oblicza wartość funkcji tansig dla pierwszej warstwy
        n = np.dot(self.w2, self.y1)	                                          # Obliczanie iloczynu skalarnego warstwy 2 i wyjścia pierwszej warstwy y1
        self.y2 = net.tansig( n,  self.b2*np.ones(n.shape))                       # Oblicza wartość funkcji tansig dla drugiej warstwy
        n = np.dot(self.w3, self.y2) 	                                          # Obliczanie iloczynu skalarnego warstwy 3 i wyjścia drugiej warstwy y2
        self.y3 = net.purelin(n, self.b3*np.ones(n.shape))                        # Oblicza wartość funkcji purelin dla trzeciej warstwy
        return self.y3 						                                      #Zwrócenie wyjścia z trzeciej warstwy jako wynik

    def train(self, x_train, y_train): 		                                      # Funkcja train przeprowadza trening sieci neuronowej przy użyciu algorytmu wstecznej propagacji błędu
        for epoch in range(1, self.max_epoch+1): 	
            self.y3 = self.predict(x_train)    	                                  # Obliczanie wartości wyjściowej sieci dla danych treningowych
            self.e = y_train - self.y3 			                                  # Obliczanie błędu predykcji
            self.SSE_t_1 = self.SSE
            self.SSE = net.sumsqr(self.e) 		                                  # Obliczanie sumy kwadratów błędów
            self.PK = sum((abs(self.e)<0.5).astype(int)[0])/self.e.shape[1] * 100 # Oblicza stopień poprawności predykcji 
            self.PK_vec.append(self.PK)				                              # Dodanie stopnia poprawności do listy
            if self.SSE < self.err_goal or self.PK == 100: 
                break 	                                                          # Zatrzymanie treningu, jeśli osiągnięto docelowy błąd lub stopień poprawności wynosi 100%
            
            if np.isnan(self.SSE): 
                break	                                                          # Zatrzymanie treningu, jeśli suma kwadratów błędów jest nieokreślona
            else:
                if self.SSE > self.er * self.SSE_t_1:			
                    self.lr *= self.ksi_dec				                          #???
                elif self.SSE < self.SSE_t_1:
                    self.lr *= self.ksi_inc				                          #???
            self.lr_vec.append(self.lr)			                                  #???

            self.d3 = net.deltalin(self.y3, self.e) 			                  # Obliczanie gradientu dla warstwy wyjściowej
            self.d2 = net.deltatan(self.y2, self.d3, self.w3) 	                  # Obliczanie gradientu dla warstwy ukrytej 2
            self.d1 = net.deltatan(self.y1, self.d2, self.w2) 	                  # Obliczanie gradientu dla warstwy ukrytej 1
            self.dw1, self.db1 = net.learnbp(x_train, self.d1, self.lr)           # Obliczanie zmiany wag i progów dla w1 i b1
            self.dw2, self.db2 = net.learnbp(self.y1, self.d2, self.lr)           # Obliczanie zmiany wag i progów dla w2 i b2
            self.dw3, self.db3 = net.learnbp(self.y2, self.d3, self.lr)           # Obliczanie zmiany wag i progów dla w3 i b3
                                                                                  # Próg jest parametrem dodatkowym w sieciach neuronowych, który wpływa na aktywację neuronów
            self.w1 += self.dw1						                              # Aktualizacja wagi w1
            self.b1 += self.db1						                              # Aktualizacja progu b1
            self.w2 += self.dw2						                              # Aktualizacja wagi w2
            self.b2 += self.db2						                              # Aktualizacja progu b2
            self.w3 += self.dw3						                              # Aktualizacja wagi w3
            self.b3 += self.db3						                              # Aktualizacja progu b3
            self.SSE_vec.append(self.SSE) 				                          # Dodanie sumy kwadratów błędów do listy
            
    def train_CV(self, CV, skfold):	                                              # Funkcja wykonuje walidację krzyżową (CV) dla sieci neuronowej
        PK_vec = np.zeros(CVN)	                                                  # Wektor do przechowywania wartości poprawności (PK) dla każdego foldu CV
        for i, (train, test) in enumerate(skfold.split(self.data,
                                                       np.squeeze(self.target))
                                          , start=0):
            x_train, x_test = self.data[train], self.data[test]
            y_train, y_test = np.squeeze(self.target)[train], np.squeeze(self.target)[test]
                                                                                  # Linia 84-86 podział danych na zbiory treningowe i testowe
            self.train(x_train.T, y_train.T)	                                  # Trenowanie sieci na zbiorze treningowym
            result = self.predict(x_test.T)	                                      # Prognozowanie wyników dla zbioru testowego
            n_test_samples = test.size		                                      # Liczba próbek w zbiorze testowym
            PK_vec[i] = sum((abs(result - y_test)<0.5).astype(int)[0])/n_test_samples * 100  # Obliczenie PK
        PK = np.mean(PK_vec)			                                          # Obliczenie średniej poprawności dla wszystkich foldów CV
        return PK				                                                  # Zwrócenie średniej poprawności klasyfikacji

x,y_t,x_norm,x_n_s,y_t_s = hkl.load('glass.hkl')	                              # Wczytanie danych z pliku 'glass.hkl'

max_epoch = 200				                                                  # Maksymalna liczba epok treningu
err_goal = 0.25 				                                                  # Docelowa wartość błędu (suma kwadratów błędów)
disp_freq = 10 				                                                  # Częstotliwość wyświetlania informacji diagnostycznych
lr = 1e-4 					                                                      # Współczynnik uczenia

CVN = 9 					                                                      # Liczba podziałów Cross-Validation
skfold = StratifiedKFold(n_splits=CVN) 	                                          # Inicjalizacja obiektu StratifiedKFold z podziałem na CVN części

K1_vec = np.array([1,3,5,7,9])	                                            	  # Wektor wartosci K1 do testów
K2_vec = K1_vec				                                                      # Wektor wartosci K2 do testów
PK_2D_K1K2 = np.zeros([len(K1_vec),len(K2_vec)])                               	  # Inicjalizacja macierzy PK_2D_K1K2

PK_2D_K1K2_max = 0		                                                 		  # Inicjalizacja maksymalnej wartości PK z macierzy PK_2D_K1K2
k1_ind_max = 0 			                                                      	  # Indeks K1 dla maksymalnej wartości PK
k2_ind_max = 0				                                                  	  # Indeks K2 dla maksymalnej wartości PK

ksi_inc_vec = np.array(np.arange(1.01,1.10,0.02))		                      	  # Wektor wartosci ksi_inc do testów
ksi_dec_vec = np.array(np.arange(0.50,0.99,0.1))		                          # Wektor wartosci ksi_dec do testów
PK_2D_IncDec = np.zeros([len(ksi_inc_vec),len(ksi_dec_vec)])                   	  # Inicjalizacja macierzy PK_2D_ IncDec

PK_2D_IncDec_max = 0		                                              		  # Inicjalizacja maksymalnej wartości PK z macierzy PK_2D_ IncDec
ksi_inc_ind_max = 0 	                                               			  # Indeks ksi_inc dla maksymalnej wartości PK
ksi_dec_ind_max = 0			                                                  	  # Indeks ksi_dec dla maksymalnej wartości PK

er_vec = np.array(np.arange(1.00,1.10,0.02))                                	  # Wektor wartosci er do testów
PK_er = np.zeros([len(er_vec)])		                                              # Inicjalizacja macierzy PK_2D_er
PK_er_max = 0					                                                  # Inicjalizacja maksymalnej wartości PK z macierzy PK_2D_er
er_ind_max = 0 			                                                      	  # Indeks er dla maksymalnej wartości PK

for k1_ind in range(len(K1_vec)):
    for k2_ind in range(len(K2_vec)):                                             # Pętle iterujące po indeksach w wektorach K1_vec oraz K2_vec
        mlpnet = mlp_a_3w(x_norm, y_t, K1_vec[k1_ind], K2_vec[k2_ind], lr,  
                          err_goal, disp_freq, ksi_inc_vec[2],ksi_dec_vec[2],             	  
                          er_vec[2], max_epoch)                                   # Inicjalizacja obiektu mlpnet klasy mlp_a_3w
        PK = mlpnet.train_CV(CVN, skfold)                                   	  # Wywołanie metody train_CV obiekctu mlpnet do obliczenia PK
        print("K1 {} | K2 {} | PK {}". format(K1_vec[k1_ind], K2_vec[k2_ind], PK))# Wyświetlenie informacji o wartości PK dla danego K1 i K2
        PK_2D_K1K2[k1_ind, k2_ind] = PK		                                      # Wpisanie wartości PK do odpowiedniej komórki w macierzy PK_2D_K1K2
        if PK > PK_2D_K1K2_max:
            PK_2D_K1K2_max = PK
            k1_ind_max = k1_ind 
            k2_ind_max = k2_ind	                                                  # Aktualizacja maksymalnej wartości PK oraz indeksów K1 i K2

fig = plt.figure(figsize=(8, 8))
ax1 = fig.add_subplot(111, projection='3d')
X, Y = np.meshgrid(K1_vec, K2_vec)
surf = ax1.plot_surface(X, Y, PK_2D_K1K2.T, cmap='viridis')

ax1.set_xlabel('K1')
ax1.set_ylabel('K2')
ax1.set_zlabel('PK')

plt.savefig("Fig.1_PK_K1K2_glass.png",bbox_inches='tight')

print("OPTYMALNE WARTOŚCI: K1={} | K2={}". 
      format(K1_vec[k1_ind_max], K2_vec[k2_ind_max]))

for ksi_inc_ind in range(len(ksi_inc_vec)):
    for ksi_dec_ind in range(len(ksi_dec_vec)):                                   # Pętle iterujące po indeksach w wektorach ksi_inc_vec oraz ksi_dec_vec
        mlpnet = mlp_a_3w(x_norm, y_t, K1_vec[k1_ind_max], K2_vec[k2_ind_max],  
                          lr, err_goal, disp_freq, ksi_inc_vec[ksi_inc_ind],
                          ksi_dec_vec[ksi_dec_ind], er_vec[2], max_epoch)         # Inicjalizacja obiektu mlpnet klasy mlp_a_3w
        PK = mlpnet.train_CV(CVN, skfold)                                     	  # Wywołanie metody train_CV obiekctu mlpnet do obliczenia PK
        print("ksi_inc {} | ksi_dec {} | PK {}".
              format(ksi_inc_vec[ksi_inc_ind], ksi_dec_vec[ksi_dec_ind], PK))     # Wyświetlenie informacji o wartości PK dla danego ksi_inc i ksi_dec
        PK_2D_IncDec[ksi_inc_ind, ksi_dec_ind] = PK                               # Wpisanie wartości PK do odpowiedniej komórki w macierzy PK_2D_IncDec
        if PK > PK_2D_IncDec_max:
            PK_2D_IncDec_max = PK
            ksi_inc_ind_max = ksi_inc_ind
            ksi_dec_ind_max = ksi_dec_ind	                                      # Aktualizacja maksymalnej wartości PK oraz indeksów ksi_inc i ksi_dec

fig = plt.figure(figsize=(8, 8))
ax2 = fig.add_subplot(111, projection='3d')
X, Y = np.meshgrid(ksi_inc_vec, ksi_dec_vec)
surf = ax2.plot_surface(X, Y, PK_2D_IncDec.T, cmap='cool')

ax2.set_xlabel('ksi_inc')
ax2.set_ylabel('ksi_dec')
ax2.set_zlabel('PK')

plt.savefig("Fig.2_PK_IncDec_glass.png",bbox_inches='tight')

print("OPTYMALNE WARTOŚCI: ksi_inc={} | ksi_dec={}". 
      format(ksi_inc_vec[ksi_inc_ind_max], ksi_dec_vec[ksi_dec_ind_max]))

for er_ind in range(len(er_vec)):                                          		  # Pętle iterujące po indeksach w wektorze er_vec
    mlpnet = mlp_a_3w(x_norm, y_t, K1_vec[k1_ind_max], K2_vec[k2_ind_max], lr, 
                      err_goal, disp_freq, ksi_inc_vec[ksi_inc_ind_max], 
                      ksi_dec_vec[ksi_dec_ind_max], er_vec[er_ind], max_epoch)    # Inicjalizacja obiektu mlpnet klasy mlp_a_3w
    
    PK = mlpnet.train_CV(CVN, skfold)                                        	  # Wywołanie metody train_CV obiekctu mlpnet do obliczenia PK
    print("er {} | PK {}". format(er_vec[er_ind], PK))                            # Wyświetlenie informacji o wartości PK dla danego er
    PK_er[er_ind] = PK		                                                      # Wpisanie wartości PK do odpowiedniej komórki w macierzy PK_2D_er
    if PK > PK_er_max:
        PK_er_max = PK
        er_ind_max = er_ind	                                                      # Aktualizacja maksymalnej wartości PK oraz indeksu er

fig = plt.figure(figsize=(8, 8))
ax3 = fig.add_subplot(111)
ax3.set_xlabel('er')
ax3.set_ylabel('PK')
ax3.plot(er_vec, PK_er)

plt.savefig("Fig.3_PK_er_glass.png",bbox_inches='tight')

print("OPTYMALNE WARTOŚCI: K1={} | K2={} | ksi_inc={} | ksi_dec={} | er={} | PK={}". 
      format(K1_vec[k1_ind_max], K2_vec[k2_ind_max], 
             ksi_inc_vec[ksi_inc_ind_max], ksi_dec_vec[ksi_dec_ind_max],
             er_vec[er_ind_max], PK_er_max))                                      # Wyświetlanie danych optymalnych
