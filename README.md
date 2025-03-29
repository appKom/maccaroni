# Onlove (Maccaroni)

Nettsiden for Onlines veldedighetsfest, er utviklet med **Next.js 15**, **App Router**, **Prisma** for ORM, **PostgreSQL** som database og **Supabase Storage** for lagring av bilder og dokumenter

## Funksjonalitet

- **Admin-panel** (begrenset tilgang):

  - [/admin](https://onlove/admin) Panel for admin dashboardet
  - [/admin/items](https://onlove.no/admin/items) Oversikt over alle auksjonsvarer, kan legge inn eller redigere auksjonsvarer. Bestående av: navn, beskrivelse, bilde, minimum budøkning og startpris.
  - [/admin/rules](https://onlove.no/admin/rules) Kan gjennom en rich text editor opprette og redigere et regelark som blir eksportert som markdown.
  - [/admin/prize-goals](https://onlove.no/admin/prize-goals) Kan se og administrere prismål. Prismålene vil bli lagt in som stretchgoals og består av: pris og beskrivelse.
  - [/admin/collected](https://onlinefondet.no/admin/collected) Her får admin brukeren en oversikt over alle innsamlede midler. Det finnes 3 typer innsamlede midler, midler som er samlet inn gjennom: stilleauksjon, live auksjon og vipps. Stilleauksjons midler blir automatisk samlet inn gjennom siden. Live auksjoner kan manuelt legges inn. Foreløpig kan admin laste opp en autogenerert faktura fra Vipps, og den vil bli parset og nye innsamlede midler blir lagt inn automatisk. Alle de 3 typene blir lagt inn i stretch goals og det totale beløpet.
  - [/admin/lykkehjul](https://onlove.no/admin/lykkehjul) Formålet med denne siden, er at den tar inn alle collected som er av typen "VIPPS" og med beskrivelse "Lodd1", "Lodd2" etc. Hvert lodd teller som et navn i lykkehjulet, og admin kan enkelt kopiere en liste med navn, med alle som har kjøpt eksempelvis Lodd1 og lime det inn i et lykkehjul

- **Offentlige sider**:
  - [/](https://onlove.no/) Viser litt om mental helse, stretchgoals, de 3 største bidragsyterne, ditt eget totale bidrag, enkel oversikt over auksjoner, liste over nylige vipps og stilleauksjons donasjoner/bud.
  - [/auksjon](https://onlove.no/auksjon) Viser alle stilleauksjons- objektene, med bilde, navn og beskrivelse. Når man trykker på "gi bud" fyller man kun ut beløp, og en JWT token med mer info blir sendt i bakgrunnen.
  - [/regelark](https://onlove.no/regelark) Viser regelarket som er opprettet i adminpanelet
  - [/lopeuka](https://onlove.no/lopeuka) Viser info om løpeuka, og hvordan man kan bli med

---

## Teknisk oversikt

- **Next.js 15**: React-rammeverk.
- **Prisma**: ORM (Object-Relational Mapping) for å håndtere databasen.
- **PostgreSQL**: Databasen som lagrer data om medlemmer, søknader og fondets prestasjon.
- **Supabase Storage**: Lagring av eventuelle filer/bilder knyttet til medlemmer eller annet innhold.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/appKom/maccaroni.git
cd maccaroni
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

#### Create `.env` file:

```bash
cp .env.example .env
```

#### Fill inn environment variables:

NODE_ENV="development"

POSTGRES_URL= # Postgres URL
POSTGRES_PRISMA_URL= # Postgres Prisma URL
SUPABASE_URL= # Supabase URL
NEXT_PUBLIC_SUPABASE_URL= # Next Public Supabase URL
POSTGRES_URL_NON_POOLING= # Postgres URL Non Pooling
SUPABASE_JWT_SECRET= # Supabase JWT Secret
POSTGRES_USER= # Postgres User
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Next Public Supabase Anon Key
POSTGRES_PASSWORD= # Postgres Password
POSTGRES_DATABASE= # Postgres Database
SUPABASE_SERVICE_ROLE_KEY= # Supabase
POSTGRES_HOST= # Postgres Host
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Next Public Supabase Anon Key

AUTH0_CLIENT_ID= # Auth0 Client ID
AUTH0_CLIENT_SECRET= # Auth0 Client Secret
AUTH0_ISSUER= # Auth0 Issuer
NEXTAUTH_SECRET= # Use [openssl rand -hex 32] to generate a 32 bytes value

NEXTAUTH_URL= # NextAuth URL e.g "http://localhost:3000"
ADMIN_EMAILS= # Admin Emails e.g "fredrik@appkom.no"
