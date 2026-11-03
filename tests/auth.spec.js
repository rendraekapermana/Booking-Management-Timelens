import { expect, test } from "@playwright/test";

const futureDate = (daysFromNow = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

const fulfillJson = (route, body, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });

test("register, manage a booking, and visit the studio workflows", async ({
  page,
}) => {
  const bookings = [];
  const expenses = [];
  const errors = [];
  let invoiceSettings = {
    studioName: "Timelens E2E Studio",
    studioPhone: "",
    studioAddress: "",
    invoicePrefix: "TL-INV-",
    invoicePattern: "",
    bankName: "BCA",
    accountNum: "8830921144",
    accountName: "Timelens",
    paymentInstruction: "",
    termsConditions: "",
    footerNote: "",
    whatsappTemplates: {
      dp: "Halo {nama_klien}",
      receipt: "Kwitansi {nama_klien}",
      reminder: "Pengingat untuk {nama_klien}",
    },
  };
  let nextBookingId = 1;
  let nextExpenseId = 1;

  page.on("pageerror", (error) => errors.push(error.message));

  await page.route("**/auth/v1/**", async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname.endsWith("/signup")) {
      const requestBody = route.request().postDataJSON();
      const timestamp = new Date().toISOString();
      const user = {
        id: "e2e-user-id",
        aud: "authenticated",
        role: "authenticated",
        email: requestBody.email,
        email_confirmed_at: timestamp,
        phone: "",
        app_metadata: { provider: "email", providers: ["email"] },
        user_metadata: {},
        identities: [],
        created_at: timestamp,
        updated_at: timestamp,
      };

      return fulfillJson(route, {
        access_token: "e2e-access-token",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: "e2e-refresh-token",
        user,
      });
    }

    if (url.pathname.endsWith("/logout")) {
      return route.fulfill({ status: 204, body: "" });
    }

    return fulfillJson(route, {
      id: "e2e-user-id",
      email: "e2e-user@timelens.test",
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: {},
    });
  });

  await page.route("**/rest/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const table = url.pathname.split("/").pop();
    const method = request.method();
    const idFilter = url.searchParams.get("id")?.replace(/^eq\./, "");

    if (table === "profiles") {
      if (method === "GET") {
        return fulfillJson(route, {
          id: "e2e-user-id",
          fullname: "E2E Studio Owner",
          phone: "08123456789",
        });
      }

      return route.fulfill({ status: 204, body: "" });
    }

    if (table === "bookings") {
      if (method === "GET") {
        const results = idFilter
          ? bookings.filter((booking) => String(booking.id) === idFilter)
          : bookings;
        return fulfillJson(route, results);
      }

      if (method === "POST") {
        const data = request.postDataJSON();
        const row = {
          id: nextBookingId++,
          created_at: new Date().toISOString(),
          ...(Array.isArray(data) ? data[0] : data),
        };
        bookings.unshift(row);
        return fulfillJson(route, row, 201);
      }

      if (method === "PATCH") {
        const update = request.postDataJSON();
        const booking = bookings.find(
          (item) => String(item.id) === idFilter,
        );
        if (!booking) {
          return fulfillJson(route, { message: "Booking not found" }, 404);
        }
        Object.assign(booking, update);
        return fulfillJson(route, booking);
      }
    }

    if (table === "expenses") {
      if (method === "GET") return fulfillJson(route, expenses);

      if (method === "POST") {
        const data = request.postDataJSON();
        const expense = {
          id: nextExpenseId++,
          ...(Array.isArray(data) ? data[0] : data),
        };
        expenses.unshift(expense);
        return fulfillJson(route, expense, 201);
      }

      if (method === "PATCH") {
        const update = request.postDataJSON();
        const expense = expenses.find(
          (item) => String(item.id) === idFilter,
        );
        if (!expense) {
          return fulfillJson(route, { message: "Expense not found" }, 404);
        }
        Object.assign(expense, update);
        return fulfillJson(route, expense);
      }

      if (method === "DELETE") {
        const index = expenses.findIndex(
          (item) => String(item.id) === idFilter,
        );
        if (index >= 0) expenses.splice(index, 1);
        return route.fulfill({ status: 204, body: "" });
      }
    }

    if (table === "app_settings") {
      if (method === "GET") {
        return fulfillJson(route, {
          setting_key: "invoice_config",
          setting_value: invoiceSettings,
        });
      }

      if (method === "POST") {
        const data = request.postDataJSON();
        invoiceSettings = {
          ...invoiceSettings,
          ...(Array.isArray(data)
            ? data[0]?.setting_value
            : data?.setting_value),
        };
        return fulfillJson(
          route,
          [{ setting_key: "invoice_config", setting_value: invoiceSettings }],
          201,
        );
      }
    }

    return fulfillJson(route, []);
  });

  await page.route("**/storage/v1/**", (route) =>
    fulfillJson(route, { Key: "payment_proofs/e2e-proof.png" }, 200),
  );
  await page.route("https://photon.komoot.io/api/**", (route) =>
    fulfillJson(route, {
      features: [
        {
          properties: {
            osm_id: 1,
            name: "Test Venue",
            city: "Jakarta",
            country: "Indonesia",
            countrycode: "ID",
          },
          geometry: { coordinates: [106.816666, -6.2] },
        },
      ],
    }),
  );
  await page.route("https://nominatim.openstreetmap.org/**", (route) =>
    fulfillJson(route, { display_name: "Test Venue, Jakarta, Indonesia" }),
  );
  await page.route("https://*.tile.openstreetmap.org/**", (route) =>
    route.abort(),
  );
  await page.route(
    "https://vlptvimjwooztqazonrq.supabase.co/storage/v1/object/sign/image_asset/**",
    (route) => route.abort(),
  );

  await test.step("register a new studio user", async () => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Sign In" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Register Account" }).click();
    await expect(
      page.getByRole("heading", { name: "Create Your Account" }),
    ).toBeVisible();

    await page.getByPlaceholder("Natasya Mareta").fill("E2E Studio Owner");
    await page.getByPlaceholder("curator@timelens.com").fill(
      `e2e-${Date.now()}@timelens.test`,
    );
    await page.getByPlaceholder("08123456789").fill("08123456789");
    await page
      .locator('input[type="password"]')
      .nth(0)
      .fill("E2e-test-password-123!");
    await page
      .locator('input[type="password"]')
      .nth(1)
      .fill("E2e-test-password-123!");
    await page.getByRole("button", { name: "Register Account" }).click();

    await expect(page.getByText("Operational Briefing")).toBeVisible();
    await expect(page.getByText("E2E Studio Owner").first()).toBeVisible();
  });

  await test.step("check dashboard and calendar navigation", async () => {
    await expect(
      page.getByRole("heading", { name: "Upcoming Events" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Calendar" }).click();
    const currentMonth = page.locator("main h1").first();
    const originalMonth = await currentMonth.textContent();
    await page.getByRole("button", { name: /Next/ }).click();
    await expect(currentMonth).not.toHaveText(originalMonth);
  });

  await test.step("submit a public reservation with a proof upload", async () => {
    await page.getByRole("button", { name: "Public Form" }).click();
    await expect(
      page.getByRole("heading", { name: "Formulir Reservasi Timelens" }),
    ).toBeVisible();

    await page.getByPlaceholder("Contoh: Sarah Natasha").fill("E2E Client");
    await page.getByPlaceholder("sarah@email.com").fill("client@timelens.test");
    await page.getByPlaceholder("0812xxxxxx").fill("08123456789");
    await page.getByPlaceholder("Contoh: Pernikahan Sarah & Dimas").fill(
      "E2E Booking",
    );
    await page.locator('input[type="date"]').fill(futureDate());
    await page.getByPlaceholder("18:00 - 22:00").fill("18:00 - 22:00");
    await page
      .getByPlaceholder("Alamat lengkap acara (jalan, gedung, patokan...)")
      .fill("Jl. Test E2E No. 1");

    const locationSearch = page.getByPlaceholder("Cari alamat / nama tempat...");
    await locationSearch.fill("Test Venue");
    await expect(page.getByText("Test Venue").last()).toBeVisible();
    await page.getByText("Test Venue").last().click();
    await expect(locationSearch).toHaveValue(/Test Venue/);

    await page.getByPlaceholder("3.500.000").fill("1000000");
    await page.locator('input[type="file"]').setInputFiles({
      name: "e2e-proof.png",
      mimeType: "image/png",
      buffer: Buffer.from("e2e test image"),
    });
    await expect(page.getByText("e2e-proof.png")).toBeVisible();

    await page.getByRole("button", { name: "Kirim Formulir Reservasi" }).click();
    await expect(
      page.getByRole("heading", { name: "Reservasi Diterima" }),
    ).toBeVisible();
    expect(bookings).toHaveLength(1);
  });

  await test.step("review the order and record its payment", async () => {
    await page.evaluate(() => {
      window.location.hash = "dashboard";
    });
    await expect(page.getByText("Operational Briefing")).toBeVisible();
    await page.getByRole("button", { name: "Incoming Orders" }).click();
    await expect(page.getByText("E2E Booking").first()).toBeVisible();

    const orderRow = page
      .getByText("E2E Booking", { exact: true })
      .locator("xpath=../../../..");
    await orderRow.locator("select").selectOption("Confirmed");
    await expect(orderRow.locator("select")).toHaveValue("Confirmed");
    await orderRow.getByRole("button", { name: "View" }).click();

    await expect(
      page.getByRole("heading", { name: "E2E Booking" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Record Payment" }).click();
    await expect(
      page.getByRole("heading", { name: "Catat Pembayaran Masuk" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Simpan Pembayaran" }).click();
    await expect(page.locator("main select").first()).toHaveValue("Fully Paid");

    await page.getByRole("button", { name: "Download Invoice" }).click();
    await expect(page.getByText(/Invoice|Kwitansi/).first()).toBeVisible();
  });

  await test.step("create an expense and export a report", async () => {
    await page.getByRole("button", { name: "Expenses" }).click();
    await page.getByRole("button", { name: "Add Expense" }).click();
    await expect(
      page.getByRole("heading", { name: "Catat Pengeluaran Operasional" }),
    ).toBeVisible();
    await page
      .getByPlaceholder("e.g. Transport & Tol antar perlengkapan booth - SCBD")
      .fill("E2E transport expense");
    await page.getByPlaceholder("250.000").fill("150000");
    await page.getByRole("button", { name: "Catat Pengeluaran" }).click();
    await expect(page.getByText("E2E transport expense")).toBeVisible();
    expect(expenses).toHaveLength(1);

    await page.getByRole("button", { name: "Reports" }).click();
    await expect(
      page.getByRole("heading", { name: /Report/ }),
    ).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download Excel" }).click();
    await downloadPromise;
  });

  await test.step("save invoice and WhatsApp templates", async () => {
    await page.getByRole("button", { name: "Invoice Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "Pengaturan Invoice & Penagihan" }),
    ).toBeVisible();

    await page.getByLabel("Nama Studio / Brand").fill("E2E Studio");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await expect(page.getByText("berhasil disimpan")).toBeVisible();

    await page.getByRole("button", { name: /Notifikasi Pesan WhatsApp/ }).click();
    await page.getByRole("button", { name: "+ {nama_klien}" }).click();
    await expect(page.getByLabel("Format Teks Pesan WhatsApp")).toHaveValue(
      /{nama_klien}/,
    );
  });

  await test.step("exercise integrations and sign out", async () => {
    await page.getByRole("button", { name: "Integrations" }).click();
    await expect(
      page.getByRole("heading", { name: "Google Calendar Auto-Sync" }),
    ).toBeVisible();
    await page.locator("button.w-11").click();
    await expect(page.getByText("Paused")).toBeVisible();

    await page.getByRole("button", { name: "Sign Out" }).click();
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  expect(errors).toEqual([]);
});
