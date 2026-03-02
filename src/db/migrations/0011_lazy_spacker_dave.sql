CREATE TABLE "launch_notify_email" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"locale" varchar(10),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "launch_notify_email_email_unique" UNIQUE("email")
);
