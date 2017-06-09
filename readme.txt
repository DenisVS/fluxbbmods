##$Id$
##
##        Mod title:  Ajax Quick Merge Post
##
##      Mod version:  1.0
##  Works on FluxBB:  1.5.10
##     Release date:  2017-06-09
##           Author:  DenisVS (deniswebcomm@gmail.com)
##         Based on:  Ajax Quick Post by Daris (daris91@gmail.com), Merge Post for PunBB by hcs (hcs@mail.ru)
##
##      Description:  Allows quickly post a reply (using ajax) 
##                    and merge your message with last message in a topic if it was yours
##
##
##   Affected files:  admin_options.php
##                    footer.php
##                    header.php
##                    include/functions.php
##                    lang/English/common.php
##                    lang/English/post.php
##                    post.php
##                    viewtopic.php
##
##       Affects DB:  Yes
##
##       DISCLAIMER:  Please note that "mods" are not officially supported by
##                    FluxBB. Installation of this modification is done at 
##                    your own risk. Backup your forum database and any and
##                    all applicable files before proceeding.
##
##

#
#---------[ . UPLOAD ]-------------------------------------
#

files/* to /

#
#---------[ . RUN ]----------------------------------------------------------
#

install_mod.php

#
#---------[ . DELETE ]-------------------------------------------------------
#

install_mod.php

#
#---------[ . OPEN ]-------------------------------------
#

admin_options.php

#
#---------[ . FIND  (line  ~ 39) ]-------------------------
#

		'redirect_delay'		=> (intval($_POST['form']['redirect_delay']) >= 0) ? intval($_POST['form']['redirect_delay']) : 0,

#
#---------[ . ADD AFTER ]--------------------------------
#

		'merge_timeout'			=> (intval($_POST['form']['merge_timeout']) >= 0) ? intval($_POST['form']['merge_timeout']) : 0,

#
#---------[ . FIND  (line  ~ 409) ]-------------------------
#

                                                                               										<span><?php echo $lang_admin_options['Redirect time help'] ?></span>
									</td>
								</tr>

#
#---------[ . ADD AFTER ]--------------------------------
#

								<tr>
									   <th scope="row">Merge time</th>
									   <td>
											   <input type="text" name="form[merge_timeout]" size="5" maxlength="5" value="<?php echo $pun_config['o_merge_timeout'] ?>" />
											   <span>Time of merge of the post.</span>
									   </td>
								</tr>

#
#---------[ . OPEN ]-------------------------------------
#

footer.php

#
#---------[ . FIND  (line  ~ 10) ]-------------------------
#

if (!defined('PUN'))
	exit;

#
#---------[ . ADD AFTER ]--------------------------------
#

if (isset($_GET['ajax']))
{
       $db->end_transaction();
       $db->close();
       return;
}

#
#---------[ . OPEN ]-------------------------------------
#

header.php

#
#---------[ . FIND  (line  ~ 10) ]-------------------------
#

if (!defined('PUN'))
	exit;

#
#---------[ . ADD AFTER ]--------------------------------
#

if (isset($_GET['ajax']))
	return;

#
#---------[ . FIND  (line  ~ 160) ]-------------------------
#

if (!empty($page_head))
	echo implode("\n", $page_head)."\n";

#
#---------[ . ADD BEFORE ]-------------------------------
#

if (basename($_SERVER['PHP_SELF']) == 'viewtopic.php')
{
       $page_head['jquery'] = '<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.min.js"></script>';
       echo '<script type="text/javascript" src="'.$pun_config['o_base_url'].'/js/aqmp.js"></script>'."\n";
}

#
#---------[ . OPEN ]-------------------------------------
#

include/functions.php

#
#---------[ . FIND  (line  ~ 945) ]-------------------------
#

function message($message, $no_back_link = false, $http_status = null)
{

#
#---------[ . ADD AFTER ]--------------------------------
#

	if (isset($_GET['ajax']))
	{
		echo $message;
		exit;
	}

#
#---------[ . FIND  (line  ~ 1443) ]-------------------------
#

	// Prefix with base_url (unless there's already a valid URI)
	if (strpos($destination_url, 'http://') !== 0 && strpos($destination_url, 'https://') !== 0 && strpos($destination_url, '/') !== 0)

#
#---------[ . ADD BEFORE ]-------------------------------
#

	if (isset($_GET['ajax']))
		return;

#
#---------[ . OPEN ]-------------------------------------
#

lang/[language]/common.php

#
#---------[ . FIND  (line  1) ]-------------------------
#

<?php

#
#---------[ . ADD AFTER ]--------------------------------
#

setlocale(LC_TIME, $locale);

#
#---------[ . OPEN ]-------------------------------------
#

lang/[language]/post.php

#
#---------[ . FIND  (line  ~ 32) ]-------------------------
#

// Edit post

#
#---------[ . ADD AFTER ]--------------------------------
#

'Merge posts'		=>			'Merge with previous if it yours',
'Added after'		=>			'Added after',

#
#---------[ . OPEN ]-------------------------------------
#

post.php

#
#---------[ . FIND  (line  ~ 23) ]-------------------------
#

	$result = $db->query('SELECT f.id, f.forum_name, f.moderators, f.redirect_url, fp.post_replies, fp.post_topics, t.subject, t.closed, s.user_id AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') LEFT JOIN '.$db->prefix.'topic_subscriptions AS s ON (t.id=s.topic_id AND s.user_id='.$pun_user['id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$tid) or error('Unable to fetch forum info', __FILE__, __LINE__, $db->error());

#
#---------[ . REPLACE WITH ]-----------------------------
#

	$result = $db->query('SELECT f.id, f.forum_name, f.moderators, f.redirect_url, fp.post_replies, fp.post_topics, t.subject, t.closed, t.added, p.id AS post_id, p.poster_id, p.message, p.posted,  s.user_id AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id  LEFT JOIN '.$db->prefix.'posts AS p ON (t.last_post_id=p.id AND p.poster_id='.$pun_user['id'].') LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') LEFT JOIN '.$db->prefix.'topic_subscriptions AS s ON (t.id=s.topic_id AND s.user_id='.$pun_user['id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$tid) or error('Unable to fetch forum info', __FILE__, __LINE__, $db->error());

#
#---------[ . FIND  (line  ~ 170) ]-------------------------
#

	{
		require PUN_ROOT.'include/search_idx.php';

#
#---------[ . ADD AFTER ]--------------------------------
#

	   $merged=false;
		if ($cur_posting['added'] > 0) {
			$added = $cur_posting['added'];
		} else  {
			$added = $cur_posting['posted'];
		}
	   if (isset($pun_config['o_merge_timeout']) && !$pun_user['is_guest'] && !$fid && (($is_admmod && !empty($_POST['merge']) && ($_POST['merge'] == 1)) || !$is_admmod) && $cur_posting['poster_id']!=NULL && $cur_posting['message']!=NULL && ($now - $added)<$pun_config['o_merge_timeout'] && (pun_strlen($cur_posting['message'].$message) + 100 < PUN_MAX_POSTSIZE))
	   {
			$message= pun_linebreaks(pun_trim("[color=#808080][i]".$lang_post['Added after']."  ".($now-$added)." s [/i][/color]")) . "\n" . $message;
			$merged=true;
		}


#
#---------[ . FIND  (line  ~ 192) ]-------------------------
#

				// Insert the new post
				$db->query('INSERT INTO '.$db->prefix.'posts (poster, poster_id, poster_ip, message, hide_smilies, posted, topic_id) VALUES(\''.$db->escape($username).'\', '.$pun_user['id'].', \''.$db->escape(get_remote_address()).'\', \''.$db->escape($message).'\', '.$hide_smilies.', '.$now.', '.$tid.')') or error('Unable to create post', __FILE__, __LINE__, $db->error());
				$new_pid = $db->insert_id();

#
#---------[ . REPLACE WITH ]-----------------------------
#

				// Insert the new post
				if ($merged)   {
					$message = $cur_posting['message'] . "\n\n" . $message;
					$db->query('UPDATE '.$db->prefix.'posts SET message=\''.$db->escape($message).'\' WHERE  id='.$cur_posting['post_id']) or error('Unable to merge post', __FILE__, __LINE__, $db->error());
					$new_pid=$cur_posting['post_id'];
				}  else {
					$db->query('INSERT INTO '.$db->prefix.'posts (poster, poster_id, poster_ip, message, hide_smilies, posted, topic_id) VALUES(\''.$db->escape($username).'\', '.$pun_user['id'].', \''.$db->escape(get_remote_address()).'\', \''.$db->escape($message).'\', '.$hide_smilies.', '.$now.', '.$tid.')') or error('Unable to create post', __FILE__, __LINE__, $db->error());
					$new_pid = $db->insert_id();
                }


#
#---------[ . FIND  (line  ~ 212) ]-------------------------
#

			// Update topic
			$db->query('UPDATE '.$db->prefix.'topics SET num_replies=num_replies+1, last_post='.$now.', last_post_id='.$new_pid.', last_poster=\''.$db->escape($username).'\' WHERE id='.$tid) or error('Unable to update topic', __FILE__, __LINE__, $db->error());

			update_search_index('post', $new_pid, $message);

			update_forum($cur_posting['id']);

			// Should we send out notifications?
			if ($pun_config['o_topic_subscriptions'] == '1')

#
#---------[ . REPLACE WITH ]-----------------------------
#

			// Update topic
			if (!$merged) {
				$db->query('UPDATE '.$db->prefix.'topics SET num_replies=num_replies+1, last_post='.$now.', added='."0".', last_post_id='.$new_pid.', last_poster=\''.$db->escape($username).'\' WHERE id='.$tid) or error('Unable to update topic', __FILE__, __LINE__, $db->error());
				update_search_index('post', $new_pid, $message);
				update_forum($cur_posting['id']);
			} else {
				$db->query('UPDATE '.$db->prefix.'topics SET added='.$now.' WHERE id='.$tid) or error('Unable to update topic', __FILE__, __LINE__, $db->error());
				update_search_index('post', $new_pid, $message);
				update_forum($cur_posting['id']);
			}
			// Should we send out notifications?
			if ($pun_config['o_topic_subscriptions'] == '1' && !$merged)

#
#---------[ . FIND  (line  ~ 441) ]-------------------------
#

		// If the posting user is logged in, increment his/her post count
		if (!$pun_user['is_guest'])
		{
			$db->query('UPDATE '.$db->prefix.'users SET num_posts=num_posts+1, last_post='.$now.' WHERE id='.$pun_user['id']) or error('Unable to update user', __FILE__, __LINE__, $db->error());

#
#---------[ . REPLACE WITH ]-----------------------------
#

	   // If the posting user is logged in, increment his/her post count
	   if (!$pun_user['is_guest'])
	   {
			if ($merged)    {
				$db->query('UPDATE '.$db->prefix.'users SET last_post='.$now.' WHERE id='.$pun_user['id']) or error('Unable to update user', __FILE__, __LINE__, $db->error());
			}       else    {
				$db->query('UPDATE '.$db->prefix.'users SET num_posts=num_posts+1, last_post='.$now.' WHERE id='.$pun_user['id']) or error('Unable to update user', __FILE__, __LINE__, $db->error());
			}

#
#---------[ . FIND  (line  ~ 467) ]-------------------------
#

		redirect('viewtopic.php?pid='.$new_pid.'#p'.$new_pid, $lang_post['Post redirect']);
	}
}

#
#---------[ . REPLACE WITH ]-----------------------------
#

		if (isset($_GET['ajax']) && isset($_GET['ppid']))
		{
			$db->end_transaction();
			$db->close();
			//header('Location: viewtopic.php?ajax&id='.$tid.'&pcount='.intval($_GET['pcount']).'&lpid='.intval($_GET['lpid']));
			header('Location: viewtopic.php?ajax&id='.$tid.'&pcount='.(intval($_GET['pcount'])-1).'&ppid='.intval($_GET['ppid']));
		}
		redirect('viewtopic.php?pid='.$new_pid.'#p'.$new_pid, $lang_post['Post redirect']);
	}
}

if (isset($_GET['ajax']) && !empty($errors))
{
       echo implode("\n", $errors);
       exit;
}

#
#---------[ . FIND  (line  ~ 704) ]-------------------------
#

if (!$pun_user['is_guest'])
{
	if ($pun_config['o_smilies'] == '1')

#
#---------[ . REPLACE WITH ]-----------------------------
#

if (!$pun_user['is_guest'])
{
	if ($is_admmod) $checkboxes[] = '<label><input type="checkbox" name="merge" value="1" checked="checked" />'.$lang_post['Merge posts'];
	if ($pun_config['o_smilies'] == '1')

#
#---------[ . OPEN ]-------------------------------------
#

viewtopic.php

#
#---------[ . FIND  (line  ~ 10) ]-------------------------
#

require PUN_ROOT.'include/common.php';

#
#---------[ . ADD AFTER ]--------------------------------
#

require PUN_ROOT.'lang/'.$pun_user['language'].'/post.php';

#
#---------[ . FIND  (line  ~ 83) ]-------------------------
#

// Fetch some info about the topic
if (!$pun_user['is_guest'])
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, s.user_id AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'topic_subscriptions AS s ON (t.id=s.topic_id AND s.user_id='.$pun_user['id'].') LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());
else
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, 0 AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());

#
#---------[ . REPLACE WITH ]-----------------------------
#

// Fetch some info about the topic
if (!$pun_user['is_guest'])
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, t.last_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, s.user_id AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'topic_subscriptions AS s ON (t.id=s.topic_id AND s.user_id='.$pun_user['id'].') LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());
else
	$result = $db->query('SELECT t.subject, t.closed, t.num_replies, t.sticky, t.first_post_id, t.last_post_id, f.id AS forum_id, f.forum_name, f.moderators, fp.post_replies, 0 AS is_subscribed FROM '.$db->prefix.'topics AS t INNER JOIN '.$db->prefix.'forums AS f ON f.id=t.forum_id LEFT JOIN '.$db->prefix.'forum_perms AS fp ON (fp.forum_id=f.id AND fp.group_id='.$pun_user['g_id'].') WHERE (fp.read_forum IS NULL OR fp.read_forum=1) AND t.id='.$id.' AND t.moved_to IS NULL') or error('Unable to fetch topic info', __FILE__, __LINE__, $db->error());

#
#---------[ . FIND  (line  ~ 216) ]-------------------------
#

$post_count = 0; // Keep track of post numbers

// Retrieve a list of post IDs, LIMIT is (really) expensive so we only fetch the IDs here then later fetch the remaining data
$result = $db->query('SELECT id FROM '.$db->prefix.'posts WHERE topic_id='.$id.' ORDER BY id LIMIT '.$start_from.','.$pun_user['disp_posts']) or error('Unable to fetch post IDs', __FILE__, __LINE__, $db->error());

#
#---------[ . REPLACE WITH ]-----------------------------
#

// Retrieve a list of post IDs, LIMIT is (really) expensive so we only fetch the IDs here then later fetch the remaining data
if (isset($_GET['pcount'])) {
	$post_count = $start_from + intval($_GET['pcount']); // Keep track of post numbers
	$result = $db->query('SELECT id FROM '.$db->prefix.'posts WHERE topic_id='.$id.(isset($_GET['ppid']) ? ' AND id > '.intval($_GET['ppid']) : '').' ORDER BY id LIMIT '.$start_from.','.$pun_user['disp_posts']) or error('Unable to fetch post IDs', __FILE__, __LINE__, $db->error());
} else {
	$post_count = 0; // Keep track of post numbers
	$result = $db->query('SELECT id FROM '.$db->prefix.'posts WHERE topic_id='.$id.' ORDER BY id LIMIT '.$start_from.','.$pun_user['disp_posts']) or error('Unable to fetch post IDs', __FILE__, __LINE__, $db->error());
}

#
#---------[ . FIND  (line  ~ 411) ]-------------------------
#

<div class="postlinksb">
	<div class="inbox crumbsplus">
		<div class="pagepost">

#
#---------[ . ADD BEFORE ]-------------------------------
#

<div id="aqmp"></div>

#
#---------[ . FIND  (line  ~ 474) ]-------------------------
#

					</div>
				</fieldset>
			</div>
<?php flux_hook('quickpost_before_submit') ?>
			<p class="buttons"><input type="submit" name="submit" tabindex="<?php echo $cur_index++ ?>" value="<?php echo $lang_common['Submit'] ?>" accesskey="s" /> <input type="submit" name="preview" value="<?php echo $lang_topic['Preview'] ?>" tabindex="<?php echo $cur_index++ ?>" accesskey="p" /></p>

#
#---------[ . REPLACE WITH ]-----------------------------
#

<?php
$ppid = $cur_topic['last_post_id']-1;
if (!isset($ppid)) {$ppid = 0;}
if ($is_admmod) { 
?>
<label><input type="checkbox" name="merge" value="1" checked="checked" /><?php echo $lang_post['Merge posts']; ?><br /></label><?php      }       ?>
					</div>
				</fieldset>
			</div>
<?php flux_hook('quickpost_before_submit') ?>
<script type="text/javascript">
	var aqmp_last_post_id = <?php echo $cur_topic['last_post_id'] ?>;
	var aqmp_post_count = <?php echo $start_from + $post_count ?>;
	var aqmp_tid = <?php echo $id ?>;
	var aqmp_prenult_post_id = <?php echo $ppid ?>;
</script>
			<p class="buttons">
				   <input type="submit" name="submit" onclick="if (aqmp_post(this.form)) {return true;} else {return false;}" tabindex="<?php echo $cur_index++ ?>" value="<?php echo $lang_common['Submit'] ?>" accesskey="s" />
				   <input type="submit" name="preview" value="<?php echo $lang_topic['Preview'] ?>" tabindex="<?php echo $cur_index++ ?>" accesskey="p" />
				   <span id="aqmp-icon" style="background: url(img/loading.gif) no-repeat; padding: 1px 8px; margin-left: 5px; display: none;"></span>
			</p>

