CREATE TABLE "airlines" (
	"id_str"	REAL,
	"airline"	TEXT,
	"name"	TEXT,
	"retweet_count"	INTEGER,
	"text"	TEXT,
	"latitude"	REAL,
	"longitude"	REAL,
	"date"	TIMESTAMP,
	"Subjectivity"	REAL,
	"Polarity"	REAL,
	"Sentiment"	TEXT,
	"keyword"	TEXT,
	PRIMARY KEY("id_str")
)