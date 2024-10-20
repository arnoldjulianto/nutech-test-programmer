--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 16.1

-- Started on 2024-10-20 15:25:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3356 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 219 (class 1255 OID 1434553)
-- Name: get_user_balance(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_balance(membership_uuid uuid) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
          DECLARE
              total_top_up NUMERIC;
              total_payment NUMERIC;
              balance NUMERIC;
          BEGIN
            --TOTAL TOP UP
              SELECT COALESCE(SUM(total_amount), 0) INTO total_top_up
              FROM transactions
              WHERE transaction_type = 'TOPUP' and transactions.membership_id = membership_uuid;

            -- TOTAL PAYMENT
              SELECT COALESCE(SUM(total_amount), 0) INTO total_payment
              FROM transactions
              WHERE transaction_type = 'PAYMENT' and transactions.membership_id  = membership_uuid;

            -- BALANCE
              balance := total_top_up - total_payment;

              RETURN balance;
          END;
          $$;


ALTER FUNCTION public.get_user_balance(membership_uuid uuid) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 1434257)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 1434489)
-- Name: banner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banner (
    id uuid NOT NULL,
    banner_name character varying(255) NOT NULL,
    banner_image text NOT NULL,
    description text,
    created_on timestamp with time zone NOT NULL,
    updated_on timestamp with time zone NOT NULL
);


ALTER TABLE public.banner OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 1434356)
-- Name: membership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membership (
    id uuid NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    access_token text,
    jwt_secret text,
    created_on timestamp with time zone NOT NULL,
    updated_on timestamp with time zone NOT NULL,
    last_login timestamp with time zone,
    profile_image text
);


ALTER TABLE public.membership OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 1434530)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid NOT NULL,
    service_code character varying(255) NOT NULL,
    service_name character varying(255) NOT NULL,
    service_icon text NOT NULL,
    service_tarif numeric(11,0) NOT NULL,
    description text,
    created_on timestamp with time zone NOT NULL,
    updated_on timestamp with time zone NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 1434591)
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid NOT NULL,
    invoice_number character varying(255),
    transaction_type character varying(50) NOT NULL,
    description text,
    total_amount numeric(11,0) NOT NULL,
    membership_id uuid NOT NULL,
    ref_id uuid,
    created_on timestamp with time zone NOT NULL,
    updated_on timestamp with time zone NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- TOC entry 3346 (class 0 OID 1434257)
-- Dependencies: 214
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
\.


--
-- TOC entry 3348 (class 0 OID 1434489)
-- Dependencies: 216
-- Data for Name: banner; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banner (id, banner_name, banner_image, description, created_on, updated_on) FROM stdin;
88d374c8-bf92-4640-bcb2-f37c0a425d2b	Banner 1	https://nutech-integrasi.app/dummy.jpg	Lerem Ipsum Dolor sit amet	2024-10-19 16:58:36+07	2024-10-19 16:58:36+07
870cf4e8-20ad-40a4-8b92-0ddfd3750c47	Banner 2	https://nutech-integrasi.app/dummy.jpg	Lerem Ipsum Dolor sit amet	2024-10-19 16:58:36+07	2024-10-19 16:58:36+07
f7edf73c-f0fa-47f4-adbf-90b9d538d471	Banner 3	https://nutech-integrasi.app/dummy.jpg	Lerem Ipsum Dolor sit amet	2024-10-19 16:58:36+07	2024-10-19 16:58:36+07
6433c7ba-c9ec-45f3-a6ab-52222233f079	Banner 4	https://nutech-integrasi.app/dummy.jpg	Lerem Ipsum Dolor sit amet	2024-10-19 16:58:36+07	2024-10-19 16:58:36+07
6e782d26-cdc7-4082-93b0-4a615b7cdf56	Banner 5	https://nutech-integrasi.app/dummy.jpg	Lerem Ipsum Dolor sit amet	2024-10-19 16:58:36+07	2024-10-19 16:58:36+07
89df88ff-1cb1-4579-b65a-af1495597d6e	Banner 6	https://nutech-integrasi.app/dummy.jpg	Lerem Ipsum Dolor sit amet	2024-10-19 16:58:36+07	2024-10-19 16:58:36+07
\.


--
-- TOC entry 3347 (class 0 OID 1434356)
-- Dependencies: 215
-- Data for Name: membership; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membership (id, first_name, last_name, email, password, access_token, jwt_secret, created_on, updated_on, last_login, profile_image) FROM stdin;
\.


--
-- TOC entry 3349 (class 0 OID 1434530)
-- Dependencies: 217
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, service_code, service_name, service_icon, service_tarif, description, created_on, updated_on) FROM stdin;
289a65ce-d9eb-49ad-b8b4-4db1297c5050	PAJAK	Pajak PBB	https://nutech-integrasi.app/dummy.jpg	40000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
1ef164df-a539-4163-bb30-eb3943c24218	PLN	Listrik	https://nutech-integrasi.app/dummy.jpg	10000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
9fc4cafd-1e1d-4b26-8670-9351df89c494	PDAM	PDAM Berlangganan	https://nutech-integrasi.app/dummy.jpg	40000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
19632796-e17c-45c1-a028-a5bf6e751729	PULSA	Pulsa	https://nutech-integrasi.app/dummy.jpg	40000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
0be5f8e4-3b9a-41a2-8ba7-7071762b71ee	PGN	PGN Berlangganan	https://nutech-integrasi.app/dummy.jpg	50000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
d0e66968-ae41-465b-bec4-e8a7b0fd8359	MUSIK	Musik Berlangganan	https://nutech-integrasi.app/dummy.jpg	50000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
b3c49226-9840-4079-bd89-22b028ad6078	TV	TV Berlangganan	https://nutech-integrasi.app/dummy.jpg	50000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
5889e1ca-2433-4ce8-8fb7-9b13f951b39f	PAKET_DATA	Paket Data	https://nutech-integrasi.app/dummy.jpg	50000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
4a90a8da-5bd0-4d1b-9e37-d336958a8547	VOUCHER_GAME	Voucher Game	https://nutech-integrasi.app/dummy.jpg	100000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
aa6407cf-4d53-4225-a96d-08279c2157d6	VOUCHER_MAKANAN	Voucher Makanan	https://nutech-integrasi.app/dummy.jpg	100000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
dee40dc8-66f2-4323-a02f-40c6259ee864	QURBAN	Qurban	https://nutech-integrasi.app/dummy.jpg	100000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
393deb0c-a44b-448c-bbf1-d2caa483085a	ZAKAT	Zakat	https://nutech-integrasi.app/dummy.jpg	100000	\N	2024-10-19 17:17:04+07	2024-10-19 17:17:04+07
\.


--
-- TOC entry 3350 (class 0 OID 1434591)
-- Dependencies: 218
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, invoice_number, transaction_type, description, total_amount, membership_id, ref_id, created_on, updated_on) FROM stdin;
\.


--
-- TOC entry 3190 (class 2606 OID 1434261)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 3194 (class 2606 OID 1434495)
-- Name: banner banner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banner
    ADD CONSTRAINT banner_pkey PRIMARY KEY (id);


--
-- TOC entry 3192 (class 2606 OID 1434362)
-- Name: membership membership_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (id);


--
-- TOC entry 3196 (class 2606 OID 1434536)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 3198 (class 2606 OID 1434538)
-- Name: services services_service_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_service_code_key UNIQUE (service_code);


--
-- TOC entry 3200 (class 2606 OID 1434599)
-- Name: transactions transactions_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_number_key UNIQUE (invoice_number);


--
-- TOC entry 3202 (class 2606 OID 1434597)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3203 (class 2606 OID 1434600)
-- Name: transactions transactions_membership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_membership_id_fkey FOREIGN KEY (membership_id) REFERENCES public.membership(id);


-- Completed on 2024-10-20 15:25:41

--
-- PostgreSQL database dump complete
--

