# 📚 JobAutoApp - Przewodnik Użytkownika

## Spis treści

1. [Wprowadzenie](#wprowadzenie)
2. [Wymagania systemowe](#wymagania-systemowe)
3. [Instalacja](#instalacja)
4. [Konfiguracja](#konfiguracja)
5. [Użytkowanie](#użytkowanie)
6. [Funkcje](#funkcje)
7. [Bezpieczeństwo](#bezpieczeństwo)
8. [Rozwiązywanie problemów](#rozwiązywanie-problemów)
9. [FAQ](#faq)

---

## Wprowadzenie

**JobAutoApp** to inteligentne narzędzie do automatycznego wyszukiwania i aplikowania na oferty pracy na portalach **OLX.pl** i **Pracuj.pl**. Aplikacja automatycznie:

- 🔍 Wyszukuje oferty pracy na podstawie Twoich kryteriów
- 📝 Wypełnia formularze aplikacji Twoimi danymi
- ✅ Sprawdza duplikaty, aby uniknąć wielokrotnych aplikacji
- 📊 Śledzi historię wszystkich aplikacji
- 🔐 Bezpiecznie przechowuje dane logowania

---

## Wymagania systemowe

### Minimalne wymagania:

- **Node.js** v18 lub nowszy
- **pnpm** v10 lub nowszy
- **MySQL/TiDB** dostęp do bazy danych
- **Przeglądarka** Chrome, Firefox, Safari lub Edge (do logowania)

### Zalecane:

- **Linux/macOS** lub **Windows** z WSL2
- **4GB RAM** minimum
- **Stabilne połączenie internetowe**

---

## Instalacja

### Krok 1: Klonowanie repozytorium

```bash
git clone https://github.com/Mikita-Khaladzenka/job-auto-app.git
cd job-auto-app
```

### Krok 2: Instalacja zależności

```bash
pnpm install
```

### Krok 3: Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local` w katalogu głównym projektu:

```env
# Baza danych
DATABASE_URL=mysql://user:password@localhost:3306/job_auto_app

# OAuth (Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# JWT
JWT_SECRET=your_secret_key_here

# Szyfrowanie haseł
ENCRYPTION_KEY=your_encryption_key_here
```

### Krok 4: Inicjalizacja bazy danych

```bash
pnpm db:push
```

### Krok 5: Uruchomienie aplikacji

**Tryb deweloperski:**
```bash
pnpm dev
```

**Tryb produkcji:**
```bash
pnpm build
pnpm start
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

---

## Konfiguracja

### 1. Logowanie do aplikacji

1. Otwórz aplikację w przeglądarce
2. Kliknij przycisk **"Zaloguj się i zacznij"**
3. Zaloguj się za pomocą Manus OAuth
4. Po zalogowaniu będziesz przekierowany na stronę główną

### 2. Konfiguracja portali pracy

Przejdź do sekcji **"Konfiguracja"** i dodaj swoje dane logowania:

#### OLX.pl
1. Kliknij na zakładkę **"OLX.pl"**
2. Wpisz swój email i hasło do konta OLX
3. Kliknij **"Zapisz dane OLX"**

#### Pracuj.pl
1. Kliknij na zakładkę **"Pracuj.pl"**
2. Wpisz swój email i hasło do konta Pracuj
3. Kliknij **"Zapisz dane Pracuj"**

> ⚠️ **Ważne:** Twoje hasła są szyfrowane algorytmem AES-256 i nigdy nie są wysyłane do zewnętrznych serwisów.

### 3. Uzupełnienie profilu

1. Kliknij na zakładkę **"Profil"** w sekcji Konfiguracja
2. Wpisz swoje dane:
   - **Imię** (np. Jan)
   - **Nazwisko** (np. Kowalski)
   - **Numer telefonu** (np. +48 123 456 789)
3. Kliknij **"Zapisz profil"**

Te dane będą automatycznie wstawiane do formularzy aplikacji.

---

## Użytkowanie

### Wyszukiwanie i aplikowanie

1. Przejdź do sekcji **"Wyszukiwanie"**
2. Uzupełnij formularz:
   - **Stanowisko** (np. "Frontend Developer", "Project Manager")
   - **Lokalizacja** (np. "Warszawa", "Kraków", "Zdalnie")
   - **Portal** (OLX.pl, Pracuj.pl lub oba)
3. Kliknij **"Uruchom wyszukiwanie"**

Aplikacja będzie:
- ✅ Wyszukiwać oferty spełniające Twoje kryteria
- ✅ Sprawdzać, czy już aplikowałeś na daną ofertę
- ✅ Automatycznie wypełniać formularze
- ✅ Wysyłać aplikacje

### Monitorowanie postępu

Po uruchomieniu wyszukiwania zobaczysz informacje:
- 📊 Liczba wysłanych aplikacji
- ⚠️ Liczba błędów
- 📝 Szczegóły każdego błędu

### Przeglądanie historii

1. Przejdź do sekcji **"Dashboard"**
2. Zobaczysz:
   - **Razem aplikacji** - całkowita liczba aplikacji
   - **Wysłane** - pomyślnie wysłane aplikacje
   - **Oczekujące** - aplikacje w trakcie
   - **Błędy** - aplikacje, które nie powiodły się
3. Tabela zawiera szczegóły każdej aplikacji:
   - Stanowisko
   - Firma
   - Portal
   - Status
   - Data aplikacji

---

## Funkcje

### 🔐 Bezpieczne przechowywanie danych

- Hasła są szyfrowane algorytmem **AES-256**
- Dane logowania nigdy nie są wysyłane do zewnętrznych serwisów
- Każdy użytkownik ma oddzielne, zaszyfrowane dane

### 🤖 Automatyczne wyszukiwanie

- Wyszukiwanie na podstawie stanowiska i lokalizacji
- Obsługa wielu portali jednocześnie
- Inteligentne sprawdzanie duplikatów

### 📊 Statystyki i raportowanie

- Pełna historia wszystkich aplikacji
- Statystyki w czasie rzeczywistym
- Możliwość śledzenia sukcesu

### ⚡ Szybkie aplikowanie

- Automatyczne wypełnianie formularzy
- Minimalizacja czasu aplikowania
- Brak konieczności ręcznego wypełniania

### 🔄 Integracja z portalami

- Obsługa OLX.pl
- Obsługa Pracuj.pl
- Łatwe dodawanie nowych portali

---

## Bezpieczeństwo

### Szyfrowanie danych

Wszystkie hasła są szyfrowane za pomocą **crypto-js** z algorytmem **AES-256**:

```javascript
// Hasło jest szyfrowane przed zapisaniem
const encrypted = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();

// Hasło jest deszyfrowane tylko gdy jest potrzebne
const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
```

### Bezpieczne przesyłanie danych

- Wszystkie połączenia używają **HTTPS**
- Dane logowania nigdy nie są przechowywane w cookies
- Sesje są chronione tokenami JWT

### Najlepsze praktyki

1. **Zmień klucz szyfrowania** w produkcji
2. **Używaj silnych haseł** do swoich kont
3. **Regularnie sprawdzaj** historię aplikacji
4. **Nie udostępniaj** danych logowania innym

---

## Rozwiązywanie problemów

### Problem: "Błąd logowania do portalu"

**Rozwiązanie:**
1. Sprawdź, czy Twoje dane logowania są poprawne
2. Upewnij się, że Twoje konto nie jest zablokowane
3. Spróbuj zalogować się ręcznie do portalu
4. Sprawdź, czy portal jest dostępny

### Problem: "Brak konfiguracji portalu"

**Rozwiązanie:**
1. Przejdź do sekcji "Konfiguracja"
2. Dodaj dane logowania do wybranego portalu
3. Upewnij się, że dane zostały zapisane (zielona ikona ✓)

### Problem: "Aplikacja nie wysyła się"

**Rozwiązanie:**
1. Sprawdź, czy profil jest uzupełniony
2. Upewnij się, że masz stabilne połączenie internetowe
3. Spróbuj ponownie uruchomić wyszukiwanie
4. Sprawdź logi błędów w dashboardzie

### Problem: "Baza danych nie odpowiada"

**Rozwiązanie:**
1. Sprawdź zmienną `DATABASE_URL`
2. Upewnij się, że baza danych jest uruchomiona
3. Sprawdź połączenie sieciowe
4. Spróbuj uruchomić `pnpm db:push` ponownie

### Problem: "Strona nie ładuje się"

**Rozwiązanie:**
1. Wyczyść cache przeglądarki (Ctrl+Shift+Delete)
2. Spróbuj w innej przeglądarce
3. Restartuj serwer deweloperski (`pnpm dev`)
4. Sprawdź konsolę przeglądarki (F12) pod kątem błędów

---

## FAQ

### P: Czy moje hasła są bezpieczne?

**O:** Tak! Wszystkie hasła są szyfrowane algorytmem AES-256 i przechowywane tylko w Twojej bazie danych. Nigdy nie są wysyłane do zewnętrznych serwisów.

### P: Czy mogę używać aplikacji na wielu urządzeniach?

**O:** Tak, ale musisz zalogować się na każdym urządzeniu. Dane logowania do portali są przechowywane w bazie danych, więc będą dostępne na wszystkich urządzeniach.

### P: Czy aplikacja może być zablokowana przez portale?

**O:** Istnieje takie ryzyko. Portale mogą wykryć automatyczne aplikowanie. Zalecamy:
- Używanie rozsądnych interwałów między aplikacjami
- Nie aplikowania na zbyt wiele ofert naraz
- Monitorowanie statusu konta

### P: Czy mogę dodać nowe portale?

**O:** Tak! Kod jest otwarty i można łatwo dodać nowe portale. Wystarczy:
1. Stworzyć nowy scraper w `server/scrapers/`
2. Dodać procedury tRPC
3. Zaktualizować frontend

### P: Jak usunąć swoje dane?

**O:** Możesz usunąć swoje dane logowania w sekcji "Konfiguracja". Wszystkie dane będą natychmiast usunięte z bazy danych.

### P: Czy aplikacja pracuje 24/7?

**O:** Aplikacja pracuje, gdy jest uruchomiona. Możesz:
- Uruchamiać ją ręcznie
- Zaplanować zadania cron (wymaga dodatkowej konfiguracji)
- Wdrożyć na serwer (np. Heroku, Railway)

### P: Jak zgłosić błąd?

**O:** Możesz zgłosić błąd na GitHub:
https://github.com/Mikita-Khaladzenka/job-auto-app/issues

---

## Wsparcie i kontakt

Jeśli masz pytania lub problemy:

1. **Sprawdź FAQ** - odpowiedź może już tam być
2. **Przeczytaj dokumentację** - w repozytorium GitHub
3. **Zgłoś issue** - na GitHub Issues
4. **Skontaktuj się** - z twórcą projektu

---

## Licencja

Projekt jest dostępny na licencji MIT. Możesz go używać, modyfikować i rozpowszechniać.

---

## Dziękujemy!

Dziękujemy za używanie **JobAutoApp**! Mamy nadzieję, że narzędzie pomoże Ci znaleźć idealną pracę. 🎉

**Powodzenia w poszukiwaniach pracy!** 🚀
