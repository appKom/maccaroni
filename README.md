# Onlove (Maccaroni)

Nettsiden for Onlines veldedighetsfest, er utviklet med **Next.js 15**, **App Router**, **Prisma** for ORM, **PostgreSQL** som database og **Supabase Storage** for lagring av bilder og dokumenter

## Funksjonalitet

- **Admin-panel** (begrenset tilgang):

  - [/admin](https://onlove/admin) Hovedpanelet for admin dashboardet
    ![image](https://github.com/user-attachments/assets/c6cb9c70-ff07-4b1f-b6d6-e3adb36c4353)
  - [/admin/items](https://onlove.no/admin/items) Oversikt over alle auksjonsvarer, kan legge inn eller redigere auksjonsvarer. Bestående av: navn, beskrivelse, bilde, minimum budøkning og startpris.
    ![image](https://github.com/user-attachments/assets/60f92395-7e71-43b9-b089-c987f9fc7721)
  - [/admin/rules](https://onlove.no/admin/rules) Kan gjennom en rich text editor opprette og redigere et regelark som blir eksportert som markdown.
    ![image](https://github.com/user-attachments/assets/16ed1af2-761f-490d-8f9e-a50f797b26f6)
  - [/admin/prize-goals](https://onlove.no/admin/prize-goals) Kan se og administrere prismål. Prismålene vil bli lagt in som stretchgoals og består av: pris og beskrivelse.
    ![image](https://github.com/user-attachments/assets/4a14ca18-2ed5-46d9-822c-ab480eda8708)
  - [/admin/collected](https://onlinefondet.no/admin/collected) Her får admin brukeren en oversikt over alle innsamlede midler. Det finnes 3 typer innsamlede midler, midler som er samlet inn gjennom: stilleauksjon, live auksjon og vipps. Stilleauksjons midler blir automatisk samlet inn gjennom siden. Live auksjoner kan manuelt legges inn. Foreløpig kan admin laste opp en autogenerert faktura fra Vipps, og den vil bli parset og nye innsamlede midler blir lagt inn automatisk. Alle de 3 typene blir lagt inn i stretch goals og det totale beløpet.
    ![image](https://github.com/user-attachments/assets/b3769ed0-a630-4119-850f-f85bdddf9b5f)
  - [/admin/lykkehjul](https://onlove.no/admin/lykkehjul) Formålet med denne siden, er at den tar inn alle collected som er av typen "VIPPS" og med beskrivelse "Lodd1", "Lodd2" etc. Hvert lodd teller som et navn i lykkehjulet, og admin kan enkelt kopiere en liste med navn, med alle som har kjøpt eksempelvis Lodd1 og lime det inn i et lykkehjul
    ![image](https://github.com/user-attachments/assets/b762c38f-673a-45a8-b46a-0ff3d00588b8)

- **Offentlige sider**:
  - [/](https://onlove.no/) Viser litt om mental helse, stretchgoals, de 3 største bidragsyterne, ditt eget totale bidrag, enkel oversikt over auksjoner, liste over nylige vipps og stilleauksjons donasjoner/bud.
    ![image](https://github.com/user-attachments/assets/9cb1693b-1ebd-4bf4-8d68-7be00479256b)
  - [/auksjon](https://onlove.no/auksjon) Viser alle stilleauksjons- objektene, med bilde, navn og beskrivelse. Når man trykker på "gi bud" fyller man kun ut beløp, og en JWT token med mer info blir sendt i bakgrunnen.
    ![image](https://github.com/user-attachments/assets/65b395c4-945b-45bf-8f63-f0e303105576)
  - [/regelark](https://onlove.no/regelark) Viser regelarket som er opprettet i adminpanelet
    ![image](https://github.com/user-attachments/assets/4ebbf80f-c6b7-4947-baa6-cee9b38ae316)
  - [/lopeuka](https://onlove.no/lopeuka) Viser info om løpeuka, og hvordan man kan bli med
    ![image](https://github.com/user-attachments/assets/932f974d-c499-4bcd-a2c2-24a519f49df9)

---

## Teknisk oversikt

- **Next.js 15**: React-rammeverk.
- **Prisma**: ORM (Object-Relational Mapping) for å håndtere databasen.
- **PostgreSQL**: Databasen som lagrer data om medlemmer, søknader og fondets prestasjon.
- **Supabase Storage**: Lagring av eventuelle filer/bilder knyttet til medlemmer eller annet innhold.

---

## Kom igang

### 1. Klon repoet

```bash
git clone https://github.com/appKom/maccaroni.git
cd maccaroni
```

### 2. Last ned avhengigheter

```bash
pnpm install
```

### 3. Sett opp miljøvariabler

#### Lag en `.env` fil:

```bash
cp .env.example .env
```

#### Fyll ut miljøvariabler:

- **NODE_ENV**: "development"
- **POSTGRES_URL**: Postgres URL
- **POSTGRES_PRISMA_URL**: Postgres Prisma URL
- **SUPABASE_URL**: Supabase URL
- **NEXT_PUBLIC_SUPABASE_URL**: Next Public Supabase URL
- **POSTGRES_URL_NON_POOLING**: Postgres URL Non Pooling
- **SUPABASE_JWT_SECRET**: Supabase JWT Secret
- **POSTGRES_USER**: Postgres User
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Next Public Supabase Anon Key
- **POSTGRES_PASSWORD**: Postgres Password
- **POSTGRES_DATABASE**: Postgres Database
- **SUPABASE_SERVICE_ROLE_KEY**: Supabase
- **POSTGRES_HOST**: Postgres Host
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Next Public Supabase Anon Key

- **AUTH0_CLIENT_ID**: Auth0 Client ID
- **AUTH0_CLIENT_SECRET**: Auth0 Client Secret
- **AUTH0_ISSUER**: Auth0 Issuer
- **NEXTAUTH_SECRET**: Use [openssl rand -hex 32] to generate a 32 bytes value

- **NEXTAUTH_URL**: NextAuth URL e.g "http://localhost:3000"
- **ADMIN_EMAILS**: Admin Emails e.g "fredrik@appkom.no"
