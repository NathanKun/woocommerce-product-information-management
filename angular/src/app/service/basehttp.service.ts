export abstract class BaseHttpService {
  buildDeleteRequestOption(id: number) {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body: {id: id}
    }
  }
}
