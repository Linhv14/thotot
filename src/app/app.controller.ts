import { Controller, Get, Inject, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Throttle } from '@nestjs/throttler';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  @Throttle({ default: { limit: 8, ttl: 6000 } })
  @Get('cache')
  async getData() {
    await this.cacheManager.set('cache-item', { key: 32 })
    await this.cacheManager.del('cache-item')
    await this.cacheManager.reset()
    const cacheItem = await this.cacheManager.get('cache-item')
    console.log(cacheItem)
    return "Hello cache"
  }
}
