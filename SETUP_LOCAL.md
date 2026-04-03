# 🚀 JobAutoApp - Przewodnik Instalacji Lokalnej

Ten przewodnik pomoże Ci zainstalować i uruchomić JobAutoApp na swoim komputerze.

---

## Krok 1: Instalacja Node.js i pnpm

### Na Ubuntu/Debian:

```bash
# Zainstaluj Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Zainstaluj pnpm
npm install -g pnpm

# Sprawdź wersje
node --version
npm --version
pnpm --version
```

### Na Windows:

1. Pobierz Node.js z https://nodejs.org/ (wersja LTS)
2. Zainstaluj Node.js (zaznacz opcję "Add to PATH")
3. Otwórz PowerShell i zainstaluj pnpm:
```powershell
npm install -g pnpm
```
4. Sprawdź wersje:
```powershell
node --version
pnpm --version
```

### Na macOS:

```bash
# Zainstaluj Homebrew (jeśli nie masz)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Zainstaluj Node.js
brew install node

# Zainstaluj pnpm
npm install -g pnpm

# Sprawdź wersje
node --version
pnpm --version
```

---

## Krok 2: Instalacja MySQL/MariaDB

### Na Ubuntu/Debian:

```bash
# Zainstaluj MySQL Server
sudo apt-get install -y mysql-server

# Uruchom MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Zaloguj się do MySQL
sudo mysql -u root
```

W konsoli MySQL:
```sql
-- Utwórz bazę danych
CREATE DATABASE job_auto_app;

-- Utwórz użytkownika
CREATE USER 'job_user'@'localhost' IDENTIFIED BY 'secure_password_123';

-- Przyznaj uprawnienia
GRANT ALL PRIVILEGES ON job_auto_app.* TO 'job_user'@'localhost';
FLUSH PRIVILEGES;

-- Wyjdź
EXIT;
```

### Na Windows:

1. Pobierz MySQL Community Server z https://dev.mysql.com/downloads/mysql/
2. Zainstaluj MySQL Server
3. Podczas instalacji:
   - Ustaw port: `3306`
   - Ustaw root password: `root_password_123`
   - Zaznacz "Configure MySQL as a Windows Service"

4. Otwórz Command Prompt i zaloguj się:
```cmd
mysql -u root -p
```

W konsoli MySQL:
```sql
CREATE DATABASE job_auto_app;
CREATE USER 'job_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON job_auto_app.* TO 'job_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Na macOS:

```bash
# Zainstaluj MySQL za pomocą Homebrew
brew install mysql

# Uruchom MySQL
brew services start mysql

# Zaloguj się
mysql -u root
```

W konsoli MySQL:
```sql
CREATE DATABASE job_auto_app;
CREATE USER 'job_user'@'localhost' IDENTIFIED BY 'secure_password_123';
GRANT ALL PRIVILEGES ON job_auto_app.* TO 'job_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## Krok 3: Klonowanie repozytorium

```bash
# Klonuj projekt
git clone https://github.com/Mikita-Khaladzenka/job-auto-app.git
cd job-auto-app

# Zainstaluj zależności
pnpm install
```

---

## Krok 4: Konfiguracja zmiennych środowiskowych

### Utwórz plik `.env.local` w katalogu głównym projektu

Na Linux/macOS:
```bash
touch .env.local
nano .env.local
```

Na Windows (PowerShell):
```powershell
New-Item -Path ".env.local" -ItemType File
notepad .env.local
```

### Zawartość `.env.local`:

```env
# ===== BAZA DANYCH =====
# Format: mysql://user:password@host:port/database
DATABASE_URL=mysql://job_user:secure_password_123@localhost:3306/job_auto_app

# ===== OAUTH (MANUS) =====
# Te wartości są dla lokalnego testowania
# W produkcji będą różne
VITE_APP_ID=local_dev_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# ===== JWT SECRET =====
# Wygeneruj losowy string (min 32 znaki)
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_32_characters_long_12345

# ===== SZYFROWANIE HASEŁ =====
# Wygeneruj losowy string (min 32 znaki)
ENCRYPTION_KEY=your_super_secret_encryption_key_that_is_at_least_32_characters_long_12345

# ===== OWNER INFO =====
# Twoje informacje (opcjonalne)
OWNER_NAME=Twoja Nazwa
OWNER_OPEN_ID=your_open_id
```

### Generowanie bezpiecznych kluczy

Na Linux/macOS:
```bash
# Wygeneruj JWT_SECRET
openssl rand -base64 32

# Wygeneruj ENCRYPTION_KEY
openssl rand -base64 32
```

Na Windows (PowerShell):
```powershell
# Wygeneruj losowy string
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Maximum 256)}))
```

Skopiuj wygenerowane wartości do `.env.local`

---

## Krok 5: Inicjalizacja bazy danych

```bash
# Wygeneruj migracje i wciśnij je do bazy danych
pnpm db:push
```

Powinieneś zobaczyć:
```
✓ Your SQL migration file ➜ drizzle/0001_lame_tomorrow_man.sql 🚀
✓ migrations applied successfully!
```

---

## Krok 6: Uruchomienie aplikacji

### Tryb deweloperski (z hot reload):

```bash
pnpm dev
```

Powinieneś zobaczyć:
```
Server running on http://localhost:3000/
```

Otwórz przeglądarkę i przejdź do: **http://localhost:3000**

### Tryb produkcji:

```bash
# Zbuduj aplikację
pnpm build

# Uruchom
pnpm start
```

---

## Krok 7: Logowanie do aplikacji

1. Otwórz http://localhost:3000 w przeglądarce
2. Kliknij **"Zaloguj się i zacznij"**
3. Zaloguj się za pomocą Manus OAuth (jeśli nie masz konta, utwórz je)
4. Po zalogowaniu będziesz na stronie głównej

---

## Konfiguracja portali pracy

### Dodaj dane logowania do OLX.pl:

1. Przejdź do **Konfiguracja** → **OLX.pl**
2. Wpisz email i hasło do OLX
3. Kliknij **"Zapisz dane OLX"**

### Dodaj dane logowania do Pracuj.pl:

1. Przejdź do **Konfiguracja** → **Pracuj.pl**
2. Wpisz email i hasło do Pracuj
3. Kliknij **"Zapisz dane Pracuj"**

### Uzupełnij profil:

1. Przejdź do **Konfiguracja** → **Profil**
2. Wpisz:
   - Imię
   - Nazwisko
   - Numer telefonu
3. Kliknij **"Zapisz profil"**

---

## Uruchomienie wyszukiwania

1. Przejdź do **Wyszukiwanie**
2. Wpisz:
   - **Stanowisko** (np. "Frontend Developer")
   - **Lokalizacja** (np. "Warszawa")
   - **Portal** (OLX.pl, Pracuj.pl lub oba)
3. Kliknij **"Uruchom wyszukiwanie"**

Aplikacja będzie automatycznie:
- 🔍 Wyszukiwać oferty
- ✅ Sprawdzać duplikaty
- 📝 Wypełniać formularze
- 📤 Wysyłać aplikacje

---

## Przeglądanie historii

1. Przejdź do **Dashboard**
2. Zobaczysz:
   - Statystyki aplikacji
   - Tabelę z historią
   - Szczegóły każdej aplikacji

---

## Rozwiązywanie problemów

### Problem: "pnpm: command not found"

**Rozwiązanie:**
```bash
# Zainstaluj pnpm globalnie
npm install -g pnpm

# Sprawdź wersję
pnpm --version
```

### Problem: "Cannot find module 'mysql2'"

**Rozwiązanie:**
```bash
# Zainstaluj zależności ponownie
pnpm install

# Lub zainstaluj konkretny pakiet
pnpm add mysql2
```

### Problem: "Error: connect ECONNREFUSED 127.0.0.1:3306"

**Rozwiązanie:**
1. Sprawdź, czy MySQL jest uruchomiony:
   - Linux: `sudo systemctl status mysql`
   - Windows: Sprawdź Services (MySQL80)
   - macOS: `brew services list`

2. Sprawdź DATABASE_URL w `.env.local`

3. Upewnij się, że baza danych istnieje:
```bash
mysql -u job_user -p -e "SHOW DATABASES;"
```

### Problem: "Błąd podczas migracji bazy danych"

**Rozwiązanie:**
```bash
# Usuń i utwórz bazę danych od nowa
mysql -u root -p -e "DROP DATABASE job_auto_app; CREATE DATABASE job_auto_app;"

# Wciśnij migracje ponownie
pnpm db:push
```

### Problem: "Port 3000 jest już zajęty"

**Rozwiązanie:**

Na Linux/macOS:
```bash
# Znajdź proces na porcie 3000
lsof -i :3000

# Zabij proces
kill -9 <PID>
```

Na Windows (PowerShell):
```powershell
# Znajdź proces na porcie 3000
netstat -ano | findstr :3000

# Zabij proces
taskkill /PID <PID> /F
```

---

## Testy

Uruchom testy jednostkowe:

```bash
pnpm test
```

Powinieneś zobaczyć:
```
✓ server/auth.logout.test.ts (1 test)
✓ server/routers.test.ts (8 tests)
Test Files  2 passed (2)
Tests  9 passed (9)
```

---

## Budowanie dla produkcji

```bash
# Zbuduj aplikację
pnpm build

# Sprawdź rozmiar
du -sh dist/

# Uruchom w produkcji
pnpm start
```

---

## Wdrażanie na serwer

### Na Railway.app (rekomendowane):

1. Zaloguj się na https://railway.app
2. Utwórz nowy projekt
3. Połącz repozytorium GitHub
4. Dodaj zmienne środowiskowe
5. Deploy!

### Na Heroku:

```bash
# Zainstaluj Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Zaloguj się
heroku login

# Utwórz aplikację
heroku create job-auto-app

# Dodaj zmienne środowiskowe
heroku config:set DATABASE_URL=mysql://...
heroku config:set JWT_SECRET=...

# Wdróż
git push heroku main
```

---

## Następne kroki

1. ✅ Zainstaluj Node.js i pnpm
2. ✅ Zainstaluj MySQL
3. ✅ Sklonuj repozytorium
4. ✅ Skonfiguruj `.env.local`
5. ✅ Uruchom `pnpm db:push`
6. ✅ Uruchom `pnpm dev`
7. ✅ Otwórz http://localhost:3000
8. ✅ Zaloguj się i skonfiguruj portale
9. ✅ Uruchom wyszukiwanie!

---

## Wsparcie

Jeśli masz problemy:

1. Sprawdź logi w konsoli
2. Przeczytaj sekcję "Rozwiązywanie problemów"
3. Zgłoś issue na GitHub: https://github.com/Mikita-Khaladzenka/job-auto-app/issues

---

**Powodzenia! 🚀**
