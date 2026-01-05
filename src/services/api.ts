const BASE_URL = "http://127.0.0.1:5000";

// ADD DONATION
export const addDonationAPI = async (donation: any) => {
  const res = await fetch(`${BASE_URL}/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });

  return res.json();
};

// GET PROVIDER DONATIONS
export const fetchProviderDonations = async (providerName: string) => {
  const res = await fetch(
    `${BASE_URL}/donations?provider=${providerName}`
  );
  return res.json();
};
