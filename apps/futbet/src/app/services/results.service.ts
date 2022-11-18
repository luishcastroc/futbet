import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

import { Game, GameStatuses, Ranking, Results } from '../core';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  checkGoldenBall(results: FormArray): string | undefined {
    let message;
    const golden = [];
    for (const i in results.controls) {
      if (results.at(Number(i)).get('goldenBall')?.value) {
        golden.push(results.at(Number(i)).get('matchDay')?.value);
      }
    }
    switch (true) {
      case golden.length === 0:
        message =
          'No has agregado ningún balón de oro estas seguro? (recuerda que valen doble)';
        break;
      case golden.length > 0 && golden.length < 12: {
        const dias = String(golden);
        message = `Solo has agregado balón de oro para ${
          golden.length === 1 ? `el dia ${dias}` : `los dias ${dias}`
        } estas seguro? (recuerda que valen doble)`;
        break;
      }
    }
    return message;
  }

  generateRanking(games: Game[], results: Results[]): Ranking[] {
    const gamesToCompare = games.filter(
      game => game.gameStatus !== GameStatuses.NotStarted
    );
    const resultsToCompare = results.map(userResult => {
      const { userId, displayName } = userResult;
      return {
        userId,
        displayName,
        results: userResult.results.filter(result =>
          gamesToCompare.some(game => game.id === result.id)
        ),
      };
    });

    const ranking = resultsToCompare.map(userResult => {
      const points = userResult.results.reduce((prev, curr, i) => {
        switch (true) {
          case curr.homeScore === gamesToCompare[i].homeScore &&
            curr.awayScore === gamesToCompare[i].awayScore: {
            if (curr.goldenBall) {
              prev += 6;
            } else {
              prev += 3;
            }
            break;
          }
          case (curr.homeScore > curr.awayScore &&
            gamesToCompare[i].homeScore > gamesToCompare[i].awayScore) ||
            (curr.homeScore < curr.awayScore &&
              gamesToCompare[i].homeScore < gamesToCompare[i].awayScore) ||
            (curr.homeScore === curr.awayScore &&
              gamesToCompare[i].homeScore === gamesToCompare[i].awayScore): {
            if (curr.goldenBall) {
              prev += 2;
            } else {
              prev += 1;
            }
            break;
          }
          default:
            prev += 0;
        }
        return prev;
      }, 0);

      return {
        userId: userResult.userId,
        displayName: userResult.displayName,
        points,
      };
    });

    return ranking.sort((a, b) => b.points - a.points);
  }
}
