import { request } from '@octokit/request';
import { getCredential } from './credential';

const username = 'apigithub';
const apigithuburl = `https://${username}@api.github.com`;

void (async () => {
    const {password: PAT} = await getCredential(apigithuburl);
    await request({
        method: 'POST',
        url: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
        headers: {
            authorization: 'Bearer ' + PAT
        },
        owner: 'atao60',
        repo: 'fse-cli',
        workflow_id: 'publish.yml',
        ref: 'master'
    });
})();
