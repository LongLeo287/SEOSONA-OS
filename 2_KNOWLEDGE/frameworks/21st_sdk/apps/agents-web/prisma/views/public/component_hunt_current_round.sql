SELECT
  r.id,
  r.week_number,
  r.start_at,
  r.end_at,
  r.seasonal_tag_id
FROM
  component_hunt_rounds r
WHERE
  (
    (NOW() >= r.start_at)
    AND (NOW() <= r.end_at)
  )
LIMIT
  1;