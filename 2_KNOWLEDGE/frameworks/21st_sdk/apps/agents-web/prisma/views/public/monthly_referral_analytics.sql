SELECT
  date_trunc('month' :: text, referral_payments.payment_date) AS MONTH,
  count(*) AS payments_count,
  sum(referral_payments.amount) AS total_amount,
  avg(referral_payments.amount) AS avg_amount
FROM
  referral_payments
GROUP BY
  (
    date_trunc('month' :: text, referral_payments.payment_date)
  )
ORDER BY
  (
    date_trunc('month' :: text, referral_payments.payment_date)
  ) DESC;