BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[pilot_user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(max),
    [pw] NVARCHAR(max),
    CONSTRAINT [PK__pilot_us__3213E83FB5ABB124] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[STATION] (
    [USERNEV] VARCHAR(50),
    [EXPORTOS] CHAR(1) NOT NULL,
    [BRUTTOS] CHAR(1) NOT NULL,
    [ARJOG] CHAR(1) NOT NULL,
    [DEFARTIPUS] INT,
    [DEFRAKTAR] INT,
    [RAKTARAS] CHAR(1) NOT NULL,
    [UGYINTEZO] INT,
    [IKTSZEMCSOP] INT,
    [MINDENIRAT] CHAR(1) NOT NULL,
    [DESIGN] CHAR(1) NOT NULL,
    [HOT1] CHAR(50),
    [HOT2] CHAR(50),
    [HOT3] CHAR(50),
    [HOT4] CHAR(50),
    [HOT5] CHAR(50),
    [HOT6] CHAR(50),
    [HOT7] CHAR(50),
    [HOT8] CHAR(50),
    [HOT9] CHAR(50),
    [UGYINTEZO2] INT,
    [PRIORRAKTAR] INT,
    [MAILUSER] CHAR(30),
    [MAILPASSWORD] CHAR(12),
    [DEFPENZTAR] INT,
    [DEFPINDEX] INT,
    [CIKKCSOP] INT,
    [DEFNYELV] VARCHAR(3),
    [ETK_SORT] VARCHAR(1),
    [SZSZLA_IGHAT] VARCHAR(1),
    [BESZTERV_IGHAT] VARCHAR(1),
    [UGYFELEZHET] VARCHAR(1),
    [vszla_tart] INT,
    [szszla_tart] INT,
    [kp_szszla_tart] INT,
    [eszla_tart] INT,
    [iszla_tart] INT,
    [kp_szla_tart] INT,
    [MLAP_IGHAT] VARCHAR(1),
    [MLAP_FDGHAT] VARCHAR(1),
    [KBIZ_BE_TART] INT,
    [KBIZ_KI_TART] INT,
    [GEPKOD] INT,
    [PrSSz] INT,
    [TELEP] INT,
    [S_R_TART] INT,
    [V_R_TART] INT,
    [TS_PRINT] VARCHAR(1),
    [SA_R_TART] INT,
    [VA_R_TART] INT,
    [MLAP_FDNEZ] VARCHAR(1),
    [OSSZEGHAT] FLOAT(53),
    [AJAN_JOVAHAGY] VARCHAR(1),
    [ELAD_ARJOG] VARCHAR(1) NOT NULL,
    [UGYINT_SZCSOP] INT,
    [MLAP_TART] INT,
    [UJPROJEKT_TART] INT,
    [PROJEKT_ALLAPOT] VARCHAR(1) NOT NULL,
    [Felvjegy_tart] INT,
    [SZLAFORM] INT,
    [AJOSSZEGHAT] FLOAT(53),
    [PROJEKT_ELSZAMOL] VARCHAR(1) NOT NULL,
    [AJAN_BESZT_VEGLEGESIT] VARCHAR(1),
    [ERT_MOZGNEM] INT,
    [szem_lszgen] CHAR(1),
    [szem_lszgeni] CHAR(1),
    [szem_lszlagen] CHAR(1),
    [szem_lszlageni] CHAR(1),
    [szem_szgen] IMAGE,
    [szem_szgeni] IMAGE,
    [szem_szlagen] IMAGE,
    [szem_szlageni] IMAGE,
    [pw_date] DATETIME,
    [szem_szlawmark] IMAGE,
    [szem_lszlawmark] CHAR(1),
    [eszla2_tart] INT,
    [TUS] INT,
    [KONTROLLINGOS] TINYINT NOT NULL,
    [NYUGTA_TART] INT,
    CONSTRAINT [aaaaa_PrimaryKey] UNIQUE CLUSTERED ([USERNEV])
);

-- CreateTable
CREATE TABLE [dbo].[Tokens_v1] (
    [id] INT NOT NULL IDENTITY(1,1),
    [accessToken] NVARCHAR(max),
    [accessExpireDate] INT,
    [refreshToken] NVARCHAR(max),
    [refreshExpireDate] INT,
    [userId] INT,
    CONSTRAINT [PK__Tokens_v__3213E83F94511225] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tokens_v2] (
    [id] INT NOT NULL IDENTITY(1,1),
    [accessToken] NVARCHAR(max),
    [accessExpireDate] INT,
    [refreshToken] NVARCHAR(max),
    [refreshExpireDate] INT,
    [userName] NVARCHAR(max),
    CONSTRAINT [PK__Tokens_v2__3213E83F94511225] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [tttel] ON [dbo].[STATION]([USERNEV], [TELEP], [UGYINTEZO]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

