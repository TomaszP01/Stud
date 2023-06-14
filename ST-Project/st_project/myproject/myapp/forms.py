from django import forms

class CompanyForm(forms.Form):
    company_name = forms.CharField(label='Nazwa firmy', max_length=100)
    company_internet_address = forms.CharField(label='Adres internetowy firmy', max_length=100)
    company_address = forms.CharField(label='Adres firmy', max_length=100)
    company_post_number = forms.CharField(label='Kod pocztowy firmy', max_length=6)
    company_e_mail_address = forms.CharField(label='Adres e-mail firmy', max_length=100)
    entrepreneur = forms.CharField(label='Imię i nazwisko właściciela', max_length=100)
    company_phone = forms.CharField(label='Telefon firmy', max_length=15)
    company_NIP = forms.CharField(label='NIP firmy', max_length=10)
    company_KRS = forms.CharField(label='KRS firmy', max_length=10)
    company_REGON = forms.CharField(label='REGON firmy', max_length=14)
    kapital_skladowy = forms.CharField(label='Kapitał składowy firmy', max_length=25)
    company_bank_number = forms.CharField(label='Kod bankowy firmy', max_length=26)
    sad_rejonowy = forms.CharField(label='Sąd rejonowy', max_length=25)
    nr_sadu_rejonowego = forms.CharField(label='Numer sądu rejonowego', max_length=10)