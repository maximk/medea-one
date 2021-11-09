with A as (
select QCode
  from Quandl.EOD
 where not regexp_contains(QCode, "_")
qualify percentile_cont(Volume * Close, 0.5) over (partition by QCode) > 1e6
    and row_number() over (partition by QCode) = 1
    and count(Close) over (partition by QCode) >= 1000
)

select array(select as struct QCode as symbol from A) as params