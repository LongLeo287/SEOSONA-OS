SELECT
  u.id AS user_id,
  u.email,
  u.ref AS referral_code,
  count(rp.id) AS total_payments,
  sum(rp.amount) AS total_earned,
  avg(rp.amount) AS avg_payment,
  min(rp.payment_date) AS first_payment,
  max(rp.payment_date) AS last_payment
FROM
  (
    users u
    LEFT JOIN referral_payments rp ON ((rp.user_id = u.id))
  )
GROUP BY
  u.id,
  u.email,
  u.ref;