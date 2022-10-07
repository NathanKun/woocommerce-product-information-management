export abstract class BaseHttpService {
  buildDeleteRequestOption(id: number, force?: boolean) {
    const body = {id: id}
    if (force) {
      body['force'] = true
    }
    return {
      headers: {
        'Content-Type': 'application/json',
      },
      body
    }
  }
}
