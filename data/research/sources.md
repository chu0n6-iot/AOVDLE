# Historical roster sources and verification notes

## Scope

Research coverage starts at 2019 as requested and includes male Arena of Valor international 5v5 editions through APL 2026. Exclude Honor of Kings, women-only events, and 1v1. Event-specific source URLs and verification status are tracked in `roster_coverage_2019_2026.csv`.

## Liquipedia event sources

- AWC 2019: https://liquipedia.net/honorofkings/Arena_of_Valor_World_Cup/2019
- AIC 2019: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2019
- APL 2020: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2020
- AIC 2020: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2020
- AWC 2021: https://liquipedia.net/honorofkings/Arena_of_Valor_World_Cup/2021
- AIC 2021: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2021
- AIC 2022: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2022
- APL 2022: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2022
- APL 2023: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2023
- AIC 2023: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2023
- APL 2024: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2024
- AIC 2024: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2024
- APL 2025: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2025
- AIC 2025: https://liquipedia.net/honorofkings/Arena_of_Valor_International_Championship/2025
- APL 2026: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2026

## Cross-check sources

- AWC 2019 participant announcement: https://samurai-gamers.com/arena-of-valor/participating-teams-and-prize-pool-announced-for-arena-of-valor-world-awc-2019/
- AIC 2019 result/players listing: https://www.esportsearnings.com/tournaments/40829-aov-international-championship-2019
- AIC 2019 event report: https://www.oneesports.gg/arena-of-valor/team-flash-wins-the-arena-of-valor-international-championship-2019/
- APL 2020 results/report: https://hthgaming.com/aov/esports/arena-of-valor-premier-league-2020-8419.html
- AIC 2020 team announcement: https://www.oneesports.gg/arena-of-valor/these-12-teams-will-compete-for-the-2020-aov-international-championship/
- AIC 2020 result listing: https://www.esportsearnings.com/tournaments/45321-aov-international-championship-2020
- AWC 2021 official announcement: http://www.arenaofvalor.com/webplat/info/news_version3/26190/33375/33376/33731/m19427/202106/891817.shtml
- AWC 2021 event preview: https://www.oneesports.gg/arena-of-valor/awc-2021-schedule-results-brackets-format/
- AIC 2021 event preview: https://www.oneesports.gg/arena-of-valor/aic-2021-schedule-results-format-teams-watch/
- AIC 2021 result listing: https://www.esportsearnings.com/tournaments/50810-aov-international-championship-2021
- AIC 2022 result listing: https://www.esportsearnings.com/tournaments/53992-aov-international-championship-2022
- APL 2022 result listing: https://www.esportsearnings.com/tournaments/57731-arena-of-valor-premier-league-2022
- APL 2023 result listing: https://www.esportsearnings.com/tournaments/62626-arena-of-valor-premier-league-2023
- APL 2023 participant coverage: https://gamingonphone.com/esports/arena-of-valor-premier-league-2023-participating-teams-prize-pool/
- APL 2024 Swiss stage: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2024/Swiss_Stage
- APL 2025 wildcard stage: https://liquipedia.net/honorofkings/Arena_of_Valor_Premier_League/2025/Wildcard
- APL 2026 official event announcement: https://www.garena.sg/news/WVYUNE

## Dataset integrity findings

The existing material is not a complete or consistent playable roster database:

1. Canonical `rosters.csv` contains 50 APL 2026 rows, all partial. It has no complete 2019–2025 tournament rosters.
2. Canonical `players.csv` contains 55 APL 2026 partial player rows; five do not have corresponding rows in canonical `rosters.csv`.
3. `coaches.csv` has 14 APL 2026 records, all partial.
4. `players_addendum_2018_2019.csv` has AIC 2019 candidate players, but `rosters_addendum_2018_2019.csv` contains only AWC 2018 rows; AIC 2019 candidates have no roster relation there.
5. The AWC 2018 addendum uses separate team IDs and has partial status; it is not included in the requested 2019-onward pool.
6. Searches produced contradictory event summaries (especially AWC 2019, AWC 2021, AIC 2022, APL/AIC 2023–2025), including cross-team duplicate handles, qualification teams confused with main-event participants, and 1v1 entries. These summaries are research leads, not evidence for canonical ingestion.
7. Some existing APL 2026 role assignments and dates are not fully verified by field-level evidence. They remain partial and are quarantined from strict eligibility.

## Verification rules

- A tournament page can verify the event and team entry; it does not automatically verify every player roster membership, player nationality, role, Head Coach, or match appearance.
- `registered` and `played` are separate facts. Leave played status unknown without match logs or official lineup evidence.
- Do not infer the role from common team patterns, role histories in a different season, or match-day guesswork.
- Do not infer player country from the team's region.
- Do not infer coach designation from staff membership.
- A player version is unique to player + team + tournament/season; keep separate versions across editions.
- Only `verified` facts with supporting evidence can enter a strict Draft pool or generate synergy.
- No images were downloaded, embedded, or reused.

