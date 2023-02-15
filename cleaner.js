import { unlink } from 'fs/promises';
import config from './config.js';
import ZimuApi from './api/ZimuApi.js';

(async () => {
    // 获取所有组织/社团列表
    const organizations = await ZimuApi.findOrganizations();

    for (let i = 0; i < organizations.length; ++i) {
        const organizationId = organizations[i].id;
        console.log(`org:${organizationId}`);
        // 获取组织/社团下的up列表
        const authors = await ZimuApi.findAuthorsByOrganizationId(organizationId);
        for (let j = 0; j < authors.length; ++j) {
            const author = authors[j];
            const clips = await ZimuApi.findClipsByAuthorId(author.id, 1, 1, 10);
            if (clips.length === 0) continue;
            for (let k = 0; k < clips.length; ++k) {
                const clip = clips[k];
                try {
                    const YYYY = clip.datetime.substring(0, 4);
                    const MM = clip.datetime.substring(5, 7);
                    const DD = clip.datetime.substring(8, 10);
                    const hh = clip.datetime.substring(11, 13);
                    const mm = clip.datetime.substring(14, 16);
                    const ss = clip.datetime.substring(17, 19);
                    const flv = `${config.zimu.live.root}/${organizationId}/${author.name}/${YYYY}-${MM}/${YYYY}${MM}${DD}-${hh}${mm}${ss}-${author.name}-${clip.title}.flv`;
                    const xml = `${config.zimu.live.root}/${organizationId}/${author.name}/${YYYY}-${MM}/${YYYY}${MM}${DD}-${hh}${mm}${ss}-${author.name}-${clip.title}.xml`;
                    const txt = `${config.zimu.live.root}/${organizationId}/${author.name}/${YYYY}-${MM}/${YYYY}${MM}${DD}-${hh}${mm}${ss}-${author.name}-${clip.title}.txt`;
                    await unlink(flv);
                    console.log(`删除成功:${flv}`);
                    await unlink(xml);
                    console.log(`删除成功:${xml}`);
                    await unlink(txt);
                    console.log(`删除成功:${txt}`);
                } catch (ex) {
                }
            }
        }        
    }
})()